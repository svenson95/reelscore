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
  | 'error';

type RealtimeEnvelope<T> = {
  id: string;
  channel: string;
  event: string;
  data: T;
};

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

  connect(): void {
    if (this.eventSource) {
      return;
    }

    this.status.set('connecting');

    const eventSource = new EventSource(`${environment.api}livestream`);

    this.eventSource = eventSource;

    eventSource.onopen = (): void => {
      this.status.set('connected');

      this.liveRefreshService.stop();
    };

    eventSource.onerror = (): void => {
      this.status.set('error');

      this.liveRefreshService.start();

      void this.liveRefreshService.refresh({
        force: true,
      });
    };

    eventSource.onmessage = (event: MessageEvent<string>): void => {
      this.handleMessage(event.data);
    };
  }

  disconnect(): void {
    this.eventSource?.close();
    this.eventSource = undefined;

    this.status.set('disconnected');

    this.liveRefreshService.start();
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
