import { effect, Injectable, signal, type Signal } from '@angular/core';
import { interval, tap, type Subscription } from 'rxjs';

import { STATUS_TYPES_PLAYING, type StatusShort } from '@lib/models';

type PageRefreshOptions = {
  isPlaying: Signal<boolean>;
  canRefresh: Signal<boolean>;
  refresh: () => void | Promise<void>;
};

const REFRESH_INTERVAL = 15_000;
export const REFRESH_INTERVAL_SECONDS = REFRESH_INTERVAL / 1000;

export abstract class PageRefreshService {
  abstract init(options: PageRefreshOptions): void;
  abstract stop(): void;
  abstract hasPlayingState(states: StatusShort[]): boolean;
  abstract timer: Signal<number>;
  abstract isRunning: Signal<boolean>;
  abstract refresh(options?: { delayLoadingDone?: boolean }): Promise<void>;
}

@Injectable()
export class AbstractedPageRefreshService implements PageRefreshService {
  private readonly AUTO_REFRESH_LOADING_DELAY_MS = 1_000;

  readonly timer = signal<number>(REFRESH_INTERVAL_SECONDS);
  readonly isRunning = signal<boolean>(false);

  private readonly options = signal<PageRefreshOptions | undefined>(undefined);

  private refreshSubscription?: Subscription;

  private readonly refreshStateEffect = effect(() => {
    const options = this.options();

    if (!options) {
      return;
    }

    const isPlaying = options.isPlaying();
    const canRefresh = options.canRefresh();

    if (!isPlaying) {
      this.stopTimer();
      return;
    }

    if (canRefresh && !this.isRunning()) {
      this.start();
    }
  });

  init(options: PageRefreshOptions): void {
    this.options.set(options);
  }

  stop(): void {
    this.options.set(undefined);
    this.stopTimer();
  }

  hasPlayingState(states: StatusShort[]): boolean {
    return states.some((status) => STATUS_TYPES_PLAYING.includes(status));
  }

  async refresh(options?: { delayLoadingDone?: boolean }): Promise<void> {
    const refreshOptions = this.options();

    if (!refreshOptions?.canRefresh()) {
      return;
    }

    this.stopTimer();

    try {
      await refreshOptions.refresh();
    } catch (error) {
      console.error('Refresh failed', error);
    }

    if (options?.delayLoadingDone) {
      await this.sleep(this.AUTO_REFRESH_LOADING_DELAY_MS);
    }
  }

  private start(): void {
    const options = this.options();

    if (!options || this.refreshSubscription) {
      return;
    }

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

          await this.refresh({
            delayLoadingDone: true,
          });
        })
      )
      .subscribe();
  }

  private stopTimer(): void {
    this.refreshSubscription?.unsubscribe();
    this.refreshSubscription = undefined;

    this.timer.set(REFRESH_INTERVAL_SECONDS);
    this.isRunning.set(false);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const PAGE_REFRESH_SERVICE_PROVIDER = {
  provide: PageRefreshService,
  useClass: AbstractedPageRefreshService,
};
