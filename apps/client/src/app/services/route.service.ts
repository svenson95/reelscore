import { Injectable, Signal, computed, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { LeagueUrl } from '../constants';

export abstract class RouteService {
  abstract router: Router;
  abstract url: Signal<string | undefined>;
  abstract activeRoute: Signal<LeagueUrl>;
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

  activeRoute = computed<LeagueUrl>(() => {
    const url = this.url();
    if (url === undefined) throw new Error('route is undefined');
    const leagueUrlIndex = url.indexOf('/', 2) + 1;
    const leagueUrl = url.substring(leagueUrlIndex, url.length);
    return leagueUrl as LeagueUrl;
  });
}

export const ROUTE_SERVICE_PROVIDER = {
  provide: RouteService,
  useClass: AbstractedRouteService,
};
