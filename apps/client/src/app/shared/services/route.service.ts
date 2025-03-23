import { Injectable, Signal, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';

export abstract class RouteService {
  abstract url: Signal<string | undefined>;
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
}

export const ROUTE_SERVICE_PROVIDER = {
  provide: RouteService,
  useClass: AbstractedRouteService,
};
