import { effect, inject } from '@angular/core';

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
    // TODO route to league page
  }
}
