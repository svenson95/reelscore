import { effect, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationStart, Router } from '@angular/router';
import { filter, interval, Subscription, tap } from 'rxjs';

type PageRefreshOptions = {
  canRefresh: () => boolean;
  refresh: () => void;
};

const DEBUGGER = false;

export abstract class PageRefreshService {
  abstract init(options: PageRefreshOptions): void;
  abstract stop(): void;
}

@Injectable()
export class AbstractedPageRefreshService {
  private readonly router = inject(Router);

  private refreshSubscription?: Subscription;

  private readonly navigationStart = toSignal<NavigationStart | null>(
    this.router.events.pipe(
      filter(
        (event): event is NavigationStart => event instanceof NavigationStart
      )
    ),
    { initialValue: null }
  );

  stopOnNavigation = effect(() => {
    const event = this.navigationStart();
    if (!event) return;
    this.stop();
  });

  init(options: PageRefreshOptions): void {
    if (this.refreshSubscription) this.stop();
    this.debug('init');

    const REFRESH_INTERVAL = 20_000;

    this.refreshSubscription = interval(REFRESH_INTERVAL)
      .pipe(
        filter(() => options.canRefresh()),
        tap(() => {
          this.debug('log');
          options.refresh();
        })
      )
      .subscribe();
  }

  stop(): void {
    this.refreshSubscription?.unsubscribe();
    this.refreshSubscription = undefined;
    this.debug('stop');
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
