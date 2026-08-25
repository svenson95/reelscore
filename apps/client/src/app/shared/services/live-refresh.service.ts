import { effect, inject, Injectable, signal } from '@angular/core';
import { interval, type Subscription } from 'rxjs';

import { RefreshRegistryService } from './refresh-registry.service';

const REFRESH_INTERVAL = 20_000;
const MIN_REFRESH_INTERVAL = 20_000;

export const REFRESH_INTERVAL_SECONDS = REFRESH_INTERVAL / 1000;

type RefreshOptions = {
  force?: boolean;
};

@Injectable({ providedIn: 'root' })
export class LiveRefreshService {
  private readonly registry = inject(RefreshRegistryService);

  readonly timer = signal<number>(REFRESH_INTERVAL_SECONDS);
  readonly isRunning = signal<boolean>(false);
  readonly isRefreshing = signal<boolean>(false);

  private readonly isStarted = signal<boolean>(false);

  private refreshSubscription?: Subscription;
  private lastRefreshAt?: number;

  constructor() {
    effect(() => {
      const shouldRun = this.isStarted() && this.registry.hasLiveTargets();

      if (shouldRun) {
        this.startTimer();
      } else {
        this.stopTimer();
        this.resetTimer();
      }
    });
  }

  start(): void {
    this.isStarted.set(true);
  }

  stop(): void {
    this.isStarted.set(false);
    this.stopTimer();
    this.resetTimer();
  }

  resetTimer(): void {
    this.timer.set(REFRESH_INTERVAL_SECONDS);
  }

  async refresh(options?: RefreshOptions): Promise<boolean> {
    if (this.isRefreshing() || this.isRefreshCooldownActive()) {
      return false;
    }

    this.isRefreshing.set(true);

    try {
      const refreshed = await this.registry.refresh(options);

      if (refreshed) {
        this.lastRefreshAt = Date.now();
        this.resetTimer();
      }

      return refreshed;
    } finally {
      this.isRefreshing.set(false);
    }
  }

  private startTimer(): void {
    if (this.refreshSubscription) {
      return;
    }

    this.isRunning.set(true);

    this.refreshSubscription = interval(1000).subscribe(() => {
      this.tick();
    });
  }

  private stopTimer(): void {
    this.refreshSubscription?.unsubscribe();
    this.refreshSubscription = undefined;

    this.isRunning.set(false);
  }

  private tick(): void {
    if (this.isRefreshing()) {
      return;
    }

    const nextTimerValue = this.timer() - 1;

    if (nextTimerValue > 0) {
      this.timer.set(nextTimerValue);
      return;
    }

    this.timer.set(0);

    void this.refresh();
  }

  private isRefreshCooldownActive(): boolean {
    if (this.lastRefreshAt === undefined) {
      return false;
    }

    return Date.now() - this.lastRefreshAt < MIN_REFRESH_INTERVAL;
  }
}
