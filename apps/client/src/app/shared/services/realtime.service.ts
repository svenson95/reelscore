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

const MAX_CONNECTION_ERRORS = 3;

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

  private connectionErrors = 0;

  private realtimeDisabled = false;

  connect(): void {
    if (this.eventSource || this.realtimeDisabled) {
      return;
    }

    this.status.set('connecting');

    const eventSource = new EventSource(`${environment.api}livestream`);

    this.eventSource = eventSource;

    eventSource.onopen = (): void => {
      if (this.realtimeDisabled) {
        eventSource.close();
        return;
      }

      this.status.set('connected');

      this.liveRefreshService.stop();
    };

    eventSource.onerror = (): void => {
      this.handleConnectionError();
    };

    eventSource.onmessage = (event: MessageEvent<string>): void => {
      this.handleMessage(event.data);
    };
  }

  disconnect(): void {
    this.closeEventSource();

    this.status.set('disconnected');

    this.liveRefreshService.start();
  }

  private handleConnectionError(): void {
    this.connectionErrors++;

    if (this.connectionErrors < MAX_CONNECTION_ERRORS) {
      this.status.set('error');

      return;
    }

    this.fallbackToRefresh();
  }

  private fallbackToRefresh(): void {
    this.realtimeDisabled = true;

    this.closeEventSource();

    this.status.set('fallback');

    this.liveRefreshService.start();

    void this.liveRefreshService.refresh({
      force: true,
    });
  }

  private closeEventSource(): void {
    this.eventSource?.close();
    this.eventSource = undefined;
  }

  private handleMessage(data: string): void {
    const message = JSON.parse(data) as RealtimeEnvelope<unknown>;

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
  }
}
