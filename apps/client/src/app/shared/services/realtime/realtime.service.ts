import { DOCUMENT } from '@angular/common';
import { DestroyRef, inject, Injectable, signal } from '@angular/core';

import { REALTIME_EVENT } from '@reelscore-sdk/constants';
import type {
  LiveFixtureEventsBatchUpdateDTO,
  LiveFixtureEventsUpdateDTO,
  LiveFixturesUpdateDTO,
  LiveFixtureUpdateDTO,
} from '@reelscore-sdk/models';

import { environment } from '@app/environment';

import { LiveRefreshService } from '../live-refresh/live-refresh.service';

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

const parseOperationTime = (time: Date | string): Date =>
  time instanceof Date ? time : new Date(time);

const parseFixtureUpdate = (
  update: LiveFixtureUpdateDTO
): LiveFixtureUpdateDTO => ({
  ...update,
  operation: {
    ...update.operation,
    time: parseOperationTime(update.operation.time),
  },
});

const parseFixtureEventsUpdate = (
  update: LiveFixtureEventsUpdateDTO
): LiveFixtureEventsUpdateDTO => ({
  ...update,
  operation: {
    ...update.operation,
    time: parseOperationTime(update.operation.time),
  },
});

@Injectable({ providedIn: 'root' })
export class RealtimeService {
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly liveRefreshService = inject(LiveRefreshService);

  private eventSource?: EventSource;
  private reconnectTimeout?: ReturnType<typeof setTimeout>;
  private reconnectAttempts = 0;
  private pingTimeout?: ReturnType<typeof setTimeout>;
  private reconnectCursor?: string;
  private replayEventsSince?: number;
  private realtimeDisabled = false;
  private connectionRequested = false;

  readonly status = signal<RealtimeStatus>('disconnected');
  readonly fixturesUpdate = signal<LiveFixturesUpdateDTO | null>(null);
  readonly fixtureEventsUpdate = signal<LiveFixtureEventsBatchUpdateDTO | null>(
    null
  );

  constructor() {
    this.document.addEventListener('visibilitychange', this.onVisibilityChange);

    this.destroyRef.onDestroy(() => {
      this.connectionRequested = false;
      this.document.removeEventListener(
        'visibilitychange',
        this.onVisibilityChange
      );
      this.closeConnection();
    });
  }

  private readonly onVisibilityChange = (): void => {
    if (!this.connectionRequested || this.realtimeDisabled) {
      return;
    }

    if (this.document.hidden) {
      this.closeConnection();
      this.status.set('disconnected');
      this.liveRefreshService.start();
      return;
    }

    this.reconnectCursor = undefined;
    this.replayEventsSince = undefined;
    void this.liveRefreshService.refresh({ force: true });
    this.connect();
  };

  connect(replayEventsSince?: number): void {
    this.connectionRequested = true;
    if (!environment.realtimeEnabled && !this.realtimeDisabled) {
      this.fallbackToRefresh();
    }
    if (this.document.hidden) {
      return;
    }
    if (this.eventSource || this.reconnectTimeout || this.realtimeDisabled) {
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
    this.resetPingTimeout();

    eventSource.onopen = (): void => {
      if (eventSource !== this.eventSource) {
        return;
      }

      this.resetPingTimeout();
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

      this.scheduleReconnect();
    };
  }

  disconnect(): void {
    this.connectionRequested = false;
    this.closeConnection();

    this.status.set('disconnected');

    this.liveRefreshService.start();
  }

  private createRealtimeUrl(replayEventsSince: number): string {
    const url = new URL(`${environment.api}livestream`);

    url.searchParams.append('channel', CHANNEL);

    url.searchParams.append(
      `last_ack_${CHANNEL}`,
      this.reconnectCursor ?? String(replayEventsSince)
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

      this.reconnectCursor = message.id;
      this.markConnectionHealthy();

      switch (message.event) {
        case REALTIME_EVENT.FIXTURES_UPDATED: {
          const update = message.data as LiveFixturesUpdateDTO;

          this.fixturesUpdate.set({
            updates: update.updates.map(parseFixtureUpdate),
          });

          break;
        }

        case REALTIME_EVENT.FIXTURE_EVENTS_UPDATED: {
          const update = message.data as LiveFixtureEventsBatchUpdateDTO;

          this.fixtureEventsUpdate.set({
            updates: update.updates.map(parseFixtureEventsUpdate),
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
          this.reconnectCursor = event.cursor;
        }

        break;

      case 'reconnect':
        this.reconnect(event.timestamp);
        break;

      case 'ping':
        this.markConnectionHealthy();
        break;

      case 'error':
      case 'disconnected':
        this.scheduleReconnect();
        break;
    }
  }

  private scheduleReconnect(): void {
    this.closeConnection();

    this.status.set('error');
    this.liveRefreshService.start();

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
    if (this.eventSource) {
      this.eventSource.onopen = null;
      this.eventSource.onmessage = null;
      this.eventSource.onerror = null;
      this.eventSource.close();
    }
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

      console.warn('[realtime] ping timeout');

      this.scheduleReconnect();
    }, PING_TIMEOUT_MS);
  }

  private markConnectionHealthy(): void {
    this.reconnectAttempts = 0;
    this.status.set('connected');
    this.liveRefreshService.stop();
  }
}
