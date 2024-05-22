import { effect, inject } from '@angular/core';

import { SELECT_LEAGUE } from '../constants';
import { CompetitionUrl } from '../models';
import { LeagueService, RouteService } from '../services';

export class RouterView {
  routeService = inject(RouteService);
  leagueService = inject(LeagueService);

  routeEvent = effect(
    () => this.updateLeague(this.routeService.activeRoute()),
    { allowSignalWrites: true }
  );

  updateLeague(url: CompetitionUrl): void {
    const league = SELECT_LEAGUE.find((l) => l.url === url);
    this.leagueService.setSelectedLeague(league);
  }
}
