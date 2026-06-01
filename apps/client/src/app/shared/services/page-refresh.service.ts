import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, interval, tap } from 'rxjs';

type PageRefreshOptions = {
  canRefresh: () => boolean;
  refresh: () => void;
  intervalMs?: number;
};

export abstract class PageRefreshService {
  abstract init(options: PageRefreshOptions): void;
}

@Injectable()
export class AbstractedPageRefreshService extends PageRefreshService {
  private readonly destroyRef = inject(DestroyRef);

  init(options: PageRefreshOptions): void {
    interval(options.intervalMs ?? 30_000)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter(() => options.canRefresh()),
        tap(() => options.refresh())
      )
      .subscribe();
  }
}

export const PAGE_REFRESH_SERVICE_PROVIDER = {
  provide: PageRefreshService,
  useClass: AbstractedPageRefreshService,
};
