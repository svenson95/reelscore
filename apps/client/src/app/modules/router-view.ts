import { effect, inject } from '@angular/core';

import {
  CompetitionData,
  LeagueService,
  RouteService,
  SELECT_COMPETITION_DATA_FLAT,
} from '@app/shared';
import { CompetitionUrl } from '@lib/models';

export class RouterView {
  leagueService = inject(LeagueService);
  routeService = inject(RouteService);

  routeEvent = effect(
    () => this.updateLeague(this.routeService.activeRoute()),
    { allowSignalWrites: true }
  );

  private updateLeague(route: CompetitionUrl): void {
    const leagueData = this.findLeagueData(route);
    this.leagueService.setSelectedLeague(leagueData);
  }

  private findLeagueData(route: CompetitionUrl): CompetitionData | undefined {
    if (route === '/') return undefined;
    const params = route.split('/');
    const routePath = params[params.indexOf('leagues') + 1];
    const dataWithUrl = (data: CompetitionData) => data.url === routePath;
    const competitionData = SELECT_COMPETITION_DATA_FLAT.find(dataWithUrl);
    if (!competitionData) {
      throw new Error(`Competition data not found ('${routePath}')`);
    }

    return competitionData;
  }
}
