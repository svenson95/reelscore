import { effect, inject } from '@angular/core';

import { SELECT_LEAGUE } from '../constants';
import { LeagueUrl, SelectLeagueState } from '../models';
import { LeagueService, RouteService } from '../services';

export class RouterView {
  protected readonly routeService = inject(RouteService);
  readonly service = inject(LeagueService);
  readonly selectedLeague = this.service.selectedLeague;

  protected readonly routeEvent = effect(
    () => this.updateLeague(this.routeService.activeRoute()),
    { allowSignalWrites: true }
  );

  getLeagueByUrl(url: LeagueUrl): SelectLeagueState {
    return SELECT_LEAGUE.find((l) => l.url === url);
  }

  updateLeague(url: LeagueUrl): void {
    const league = this.getLeagueByUrl(url);
    this.service.setSelectedLeague(league);
  }

  isInvalid(routeArr: unknown | undefined): boolean {
    return routeArr === undefined;
  }
}
