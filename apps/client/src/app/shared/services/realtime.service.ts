import { inject, Injectable, signal } from '@angular/core';

import {
  REALTIME_EVENT,
  type LiveFixtureEventsUpdateDTO,
  type LiveFixtureUpdateDTO,
} from '@lib/models';

import { environment } from '../../../environments/environment';

import { LiveRefreshService } from './live-refresh.service';

export type RealtimeStatus =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'error'
  | 'fallback';

type RealtimeEnvelope<T> = {
  id: string;
  channel: string;
  event: string;
  data: T;
};

type RealtimeSystemEvent =
  | {
      type: 'connected';
      channel: string;
      cursor?: string;
    }
  | {
      type: 'reconnect';
      timestamp: number;
    }
  | {
      type: 'error';
      error: string;
    }
  | {
      type: 'disconnected';
      channels: string[];
    }
  | {
      type: 'ping';
      timestamp: number;
    };

const CHANNEL = 'default';
const MAX_RECONNECT_ATTEMPTS = 3;
const PING_TIMEOUT_MS = 75_000;

const parseOperationTime = (time: Date | string): Date => {
  return time instanceof Date ? time : new Date(time);
};

@Injectable({ providedIn: 'root' })
export class RealtimeService {
  private readonly liveRefreshService = inject(LiveRefreshService);

  readonly status = signal<RealtimeStatus>('disconnected');

  readonly fixtureUpdate = signal<LiveFixtureUpdateDTO | null>(null);

  readonly fixtureEventsUpdate = signal<LiveFixtureEventsUpdateDTO | null>(
    null
  );

  private eventSource?: EventSource;

  private reconnectTimeout?: ReturnType<typeof setTimeout>;

  private reconnectAttempts = 0;

  private pingTimeout?: ReturnType<typeof setTimeout>;

  private lastAck?: string;

  private replayEventsSince?: number;

  private realtimeDisabled = false;

  connect(replayEventsSince?: number): void {
    if (this.eventSource || this.realtimeDisabled) {
      return;
    }

    if (this.reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      this.fallbackToRefresh();
      return;
    }

    this.status.set('connecting');

    const replaySince =
      replayEventsSince ?? this.replayEventsSince ?? Date.now();

    this.replayEventsSince = replaySince;

    const url = this.createRealtimeUrl(replaySince);

    const eventSource = new EventSource(url);

    this.eventSource = eventSource;

    eventSource.onopen = (): void => {
      if (eventSource !== this.eventSource) {
        return;
      }

      this.resetPingTimeout();

      this.reconnectAttempts = 0;
      this.status.set('connected');

      this.liveRefreshService.stop();
    };

    eventSource.onmessage = (event: MessageEvent<string>): void => {
      if (eventSource !== this.eventSource) {
        return;
      }

      this.resetPingTimeout();
      this.handleMessage(event.data);
    };

    eventSource.onerror = (): void => {
      if (eventSource !== this.eventSource) {
        return;
      }

      if (eventSource.readyState === EventSource.CONNECTING) {
        return;
      }

      this.scheduleReconnect();
    };
  }

  disconnect(): void {
    this.closeConnection();

    this.status.set('disconnected');

    this.liveRefreshService.start();
  }

  private createRealtimeUrl(replayEventsSince: number): string {
    const url = new URL(`${environment.api}livestream`);

    url.searchParams.append('channel', CHANNEL);

    url.searchParams.append(
      `last_ack_${CHANNEL}`,
      this.lastAck ?? String(replayEventsSince)
    );

    return url.toString();
  }

  private handleMessage(data: string): void {
    try {
      const message = JSON.parse(data) as
        | RealtimeEnvelope<unknown>
        | RealtimeSystemEvent;

      if ('type' in message) {
        this.handleSystemEvent(message);
        return;
      }

      this.lastAck = message.id;

      switch (message.event) {
        case REALTIME_EVENT.FIXTURE_UPDATED: {
          const update = message.data as LiveFixtureUpdateDTO;

          this.fixtureUpdate.set({
            ...update,
            operation: {
              ...update.operation,
              time: parseOperationTime(update.operation.time),
            },
          });

          break;
        }

        case REALTIME_EVENT.FIXTURE_EVENTS_UPDATED: {
          const update = message.data as LiveFixtureEventsUpdateDTO;

          this.fixtureEventsUpdate.set({
            ...update,
            operation: {
              ...update.operation,
              time: parseOperationTime(update.operation.time),
            },
          });

          break;
        }
      }
    } catch (error) {
      console.warn('[realtime] failed to parse message', {
        data,
        error,
      });
    }
  }

  private handleSystemEvent(event: RealtimeSystemEvent): void {
    switch (event.type) {
      case 'connected':
        if (event.cursor) {
          this.lastAck = event.cursor;
        }

        break;

      case 'reconnect':
        this.reconnect(event.timestamp);
        break;

      case 'error':
      case 'disconnected':
      case 'ping':
        break;
    }
  }

  private scheduleReconnect(): void {
    this.closeConnection();

    this.status.set('error');

    this.reconnectAttempts++;

    if (this.reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      this.fallbackToRefresh();
      return;
    }

    const delay = Math.min(1_000 * this.reconnectAttempts, 10_000);

    this.reconnectTimeout = setTimeout(() => {
      this.reconnectTimeout = undefined;

      this.connect();
    }, delay);
  }

  private fallbackToRefresh(): void {
    this.realtimeDisabled = true;

    this.closeConnection();

    this.status.set('fallback');

    this.liveRefreshService.start();

    void this.liveRefreshService.refresh({
      force: true,
    });
  }

  private closeConnection(): void {
    this.closeEventSource();

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = undefined;
    }

    if (this.pingTimeout) {
      clearTimeout(this.pingTimeout);
      this.pingTimeout = undefined;
    }
  }

  private closeEventSource(): void {
    this.eventSource?.close();
    this.eventSource = undefined;
  }

  private reconnect(replayEventsSince?: number): void {
    this.closeConnection();
    this.connect(replayEventsSince);
  }

  private resetPingTimeout(): void {
    if (this.pingTimeout) {
      clearTimeout(this.pingTimeout);
    }

    this.pingTimeout = setTimeout(() => {
      this.pingTimeout = undefined;

      this.reconnect();
    }, PING_TIMEOUT_MS);
  }
}
