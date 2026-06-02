import { effect, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, interval, Subscription, tap } from 'rxjs';

import { getTodayDateString } from '../constants';

type PageRefreshOptions = {
  canRefresh: () => boolean;
  refresh: () => void;
};

const DEBUGGER = false;

const REFRESH_INTERVAL = 20_000;

export abstract class PageRefreshService {
  abstract init(options: PageRefreshOptions): void;
  abstract stop(): void;
}

@Injectable()
export class AbstractedPageRefreshService {
  private readonly router = inject(Router);

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
    this.options = options;
    const event = this.navigationEnd();
    const isToday = event && this.isTodayRoute(event.urlAfterRedirects);
    if (isToday) {
      this.start();
    }
  }

  stop(): void {
    this.refreshSubscription?.unsubscribe();
    this.refreshSubscription = undefined;
    this.debug('stop');
  }

  private start(): void {
    if (!this.options) return;

    if (this.refreshSubscription) this.stop();

    this.debug('init');

    this.refreshSubscription = interval(REFRESH_INTERVAL)
      .pipe(
        filter(() => this.options?.canRefresh() ?? false),
        tap(() => {
          this.debug('log');
          this.options?.refresh();
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
