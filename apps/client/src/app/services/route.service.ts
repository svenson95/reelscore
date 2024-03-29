import { Location } from '@angular/common';
import { Injectable, computed, inject } from '@angular/core';

import { LeagueUrl } from '../constants';

@Injectable()
export class RouteService {
  private readonly location = inject(Location);

  readonly activeRoute = computed<LeagueUrl>(() => {
    const url = this.location.path();
    const leagueUrlIndex = url.indexOf('/', 2) + 1;
    const path = url.substring(leagueUrlIndex, url.length);
    const result = url !== undefined ? path : '/';
    return result as LeagueUrl;
  });
}
