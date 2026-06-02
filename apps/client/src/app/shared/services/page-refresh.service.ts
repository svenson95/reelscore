import { effect, inject, Injectable, signal, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, interval, Subscription, tap } from 'rxjs';

import { STATUS_TYPES_PLAYING, type StatusShort } from '@lib/models';

import { getTodayDateString } from '../constants';

type PageRefreshOptions = {
  isPlaying: boolean;
  canRefresh: () => boolean;
  refresh: () => void;
};

const DEBUGGER = false;

const REFRESH_INTERVAL = 20_000;
export const REFRESH_INTERVAL_SECONDS = REFRESH_INTERVAL / 1000;

export abstract class PageRefreshService {
  abstract init(options: PageRefreshOptions): void;
  abstract stop(): void;
  abstract hasPlayingState(states: StatusShort[]): boolean;
  abstract timer: Signal<number>;
  abstract isRunning: Signal<boolean>;
}

@Injectable()
export class AbstractedPageRefreshService implements PageRefreshService {
  private readonly router = inject(Router);

  readonly timer = signal<number>(REFRESH_INTERVAL_SECONDS);
  readonly isRunning = signal<boolean>(false);

  private refreshSubscription?: Subscription;
  private options?: PageRefreshOptions;

  private readonly navigationEnd = toSignal<NavigationEnd | null>(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ),
    { initialValue: null }
  );

  stopOnNavigation = effect(() => {
    const event = this.navigationEnd();
    if (!event) return;

    if (this.refreshSubscription) this.stop();

    if (this.isTodayRoute(event.urlAfterRedirects)) {
      this.start();
    }
  });

  init(options: PageRefreshOptions): void {
    if (options.isPlaying) {
      this.options = options;
      this.start();
    }
  }

  stop(): void {
    this.refreshSubscription?.unsubscribe();
    this.refreshSubscription = undefined;
    this.timer.set(REFRESH_INTERVAL_SECONDS);
    this.isRunning.set(false);
  }

  hasPlayingState(states: StatusShort[]): boolean {
    return states.some((status) => STATUS_TYPES_PLAYING.includes(status));
  }

  private start(): void {
    if (!this.options) return;

    if (this.refreshSubscription) this.stop();

    this.timer.set(REFRESH_INTERVAL_SECONDS);
    this.isRunning.set(true);

    this.refreshSubscription = interval(1000)
      .pipe(
        tap(() => {
          const nextTimerValue = this.timer() - 1;

          if (nextTimerValue > 0) {
            this.timer.set(nextTimerValue);
            return;
          }

          this.timer.set(REFRESH_INTERVAL_SECONDS);

          if (this.options?.canRefresh()) {
            this.options.refresh();
          }
        })
      )
      .subscribe();
  }

  private isTodayRoute(url: string): boolean {
    const todayRoute = '/' + getTodayDateString();
    return url.includes(todayRoute);
  }

  private debug(message: string): void {
    if (DEBUGGER) {
      console.log(
        `page-refresh ${message} | `,
        new Date().toLocaleTimeString()
      );
    }
  }
}

export const PAGE_REFRESH_SERVICE_PROVIDER = {
  provide: PageRefreshService,
  useClass: AbstractedPageRefreshService,
};
