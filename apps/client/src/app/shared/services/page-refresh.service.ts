import type { Signal } from '@angular/core';
import { effect, inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import type { Subscription } from 'rxjs';
import { filter, interval, tap } from 'rxjs';

import { STATUS_TYPES_PLAYING, type StatusShort } from '@lib/models';
import { getTodayDateString } from '@lib/shared';

type PageRefreshOptions = {
  isPlaying: () => boolean;
  canRefresh: () => boolean;
  refresh: () => Promise<void>;
};

const REFRESH_INTERVAL = 15_000;
export const REFRESH_INTERVAL_SECONDS = REFRESH_INTERVAL / 1000;

export abstract class PageRefreshService {
  abstract init(options: PageRefreshOptions): void;
  abstract stop(): void;
  abstract hasPlayingState(states: StatusShort[]): boolean;
  abstract timer: Signal<number>;
  abstract isRunning: Signal<boolean>;
  abstract refresh(options?: { delayLoadingDone: boolean }): void;
}

@Injectable()
export class AbstractedPageRefreshService implements PageRefreshService {
  private readonly router = inject(Router);
  private readonly AUTO_REFRESH_LOADING_DELAY_MS = 1_000;

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
    if (options.isPlaying()) {
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
        tap(async () => {
          const nextTimerValue = this.timer() - 1;

          if (nextTimerValue > 0) {
            this.timer.set(nextTimerValue);
            return;
          }

          this.timer.set(REFRESH_INTERVAL_SECONDS);
          await this.refresh({ delayLoadingDone: true });
        })
      )
      .subscribe();
  }

  private isTodayRoute(url: string): boolean {
    const todayRoute = '/' + getTodayDateString();
    return url.includes(todayRoute);
  }

  async refresh(options?: { delayLoadingDone?: boolean }): Promise<void> {
    if (!this.options?.canRefresh()) return;

    this.stop();

    try {
      await this.options.refresh();
    } catch (error) {
      console.error('Refresh failed', error);
    } finally {
      await this.nextFrame();

      if (this.options.canRefresh()) {
        this.start();
      }

      if (options?.delayLoadingDone) {
        await this.sleep(this.AUTO_REFRESH_LOADING_DELAY_MS);
      }
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private nextFrame(): Promise<void> {
    return new Promise((resolve) => requestAnimationFrame(() => resolve()));
  }
}

export const PAGE_REFRESH_SERVICE_PROVIDER = {
  provide: PageRefreshService,
  useClass: AbstractedPageRefreshService,
};
