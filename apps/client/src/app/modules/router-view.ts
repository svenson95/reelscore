import { effect, inject } from '@angular/core';

import { SELECT_COMPETITION_DATA_FLAT } from '@app/constants';
import { LeagueService, RouteService } from '@app/services';
import { CompetitionUrl } from '@lib/models';

export class RouterView {
  routeService = inject(RouteService);
  leagueService = inject(LeagueService);

  routeEvent = effect(
    () => this.updateLeague(this.routeService.activeRoute()),
    { allowSignalWrites: true }
  );

  updateLeague(route: CompetitionUrl): void {
    const league = SELECT_COMPETITION_DATA_FLAT.find((l) => {
      const url = route.substring(0, route.indexOf('/'));
      return url === l.url;
    });
    this.leagueService.setSelectedLeague(league);
  }
}
