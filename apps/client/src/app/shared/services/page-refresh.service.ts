import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, interval, Subscription, tap } from 'rxjs';

type PageRefreshOptions = {
  canRefresh: () => boolean;
  refresh: () => void;
};

export abstract class PageRefreshService {
  abstract init(options: PageRefreshOptions): void;
  abstract stop(): void;
}

@Injectable()
export class AbstractedPageRefreshService extends PageRefreshService {
  private readonly destroyRef = inject(DestroyRef);
  private subscription?: Subscription;

  init(options: PageRefreshOptions): void {
    this.stop();
    const REFRESH_INTERVAL = 30_000;

    this.subscription = interval(REFRESH_INTERVAL)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter(() => options.canRefresh()),
        tap(() => options.refresh())
      )
      .subscribe();
  }

  stop(): void {
    this.subscription?.unsubscribe();
    this.subscription = undefined;
  }
}

export const PAGE_REFRESH_SERVICE_PROVIDER = {
  provide: PageRefreshService,
  useClass: AbstractedPageRefreshService,
};
