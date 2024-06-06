import { effect, inject } from '@angular/core';

import { COMPETITION_DATA } from '@app/constants';
import { CompetitionUrl } from '@app/models';
import { LeagueService, RouteService } from '@app/services';

export class RouterView {
  routeService = inject(RouteService);
  leagueService = inject(LeagueService);

  routeEvent = effect(
    () => this.updateLeague(this.routeService.activeRoute()),
    { allowSignalWrites: true }
  );

  updateLeague(url: CompetitionUrl): void {
    const league = COMPETITION_DATA.find((l) => url.includes(l.url));
    this.leagueService.setSelectedLeague(league);
  }
}
