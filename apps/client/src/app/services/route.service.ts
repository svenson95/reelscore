import { Injectable, computed, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { LeagueUrl } from '../constants';

@Injectable()
export class RouteService {
  private readonly router = inject(Router);

  private readonly url = toSignal<string>(
    this.router.events.pipe(
      takeUntilDestroyed(),
      filter((event) => event instanceof NavigationEnd),
      map((event) => (event as NavigationEnd).url)
    )
  );

  readonly activeRoute = computed<LeagueUrl>(() => {
    const url = this.url();
    if (url === undefined) throw new Error('route is undefined');
    const leagueUrlIndex = url.indexOf('/', 2) + 1;
    const leagueUrl = url.substring(leagueUrlIndex, url.length);
    return leagueUrl as LeagueUrl;
  });
}
