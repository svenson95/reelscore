import { effect, inject } from '@angular/core';

import { COMPETITION_DATA } from '@app/constants';
import { LeagueService, RouteService } from '@app/services';
import { CompetitionUrl } from '@lib/models';

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
