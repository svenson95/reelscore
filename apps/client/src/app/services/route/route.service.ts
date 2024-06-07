import { Injectable, Signal, computed, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';

import { CompetitionUrl } from '@app/models';

export abstract class RouteService {
  abstract url: Signal<string | undefined>;
  abstract activeRoute: Signal<CompetitionUrl>;
}

@Injectable()
export class AbstractedRouteService extends RouteService {
  router = inject(Router);

  url = toSignal<string>(
    this.router.events.pipe(
      takeUntilDestroyed(),
      filter((event) => event instanceof NavigationEnd),
      map((event) => (event as NavigationEnd).url)
    )
  );

  activeRoute = computed<CompetitionUrl>(() => {
    const url = this.url();
    if (url === undefined) throw new Error('route is undefined');
    const leagueUrlIndex = url.indexOf('/', 2) + 1;
    const leagueUrl = url.substring(leagueUrlIndex, url.length);
    return leagueUrl as CompetitionUrl;
  });
}

export const ROUTE_SERVICE_PROVIDER = {
  provide: RouteService,
  useClass: AbstractedRouteService,
};
