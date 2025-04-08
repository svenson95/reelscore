import { effect, inject } from '@angular/core';

import {
  CompetitionData,
  LeagueService,
  RouteService,
  SELECT_COMPETITION_DATA_FLAT,
} from '../shared';

export class RouterView {
  leagueService = inject(LeagueService);
  routeService = inject(RouteService);

  routeEvent = effect(() => this.updateLeague(this.routeService.url()));

  private updateLeague(route: string | undefined): void {
    const leagueData = this.findLeagueData(route);
    this.leagueService.setSelectedLeague(leagueData);
  }

  private findLeagueData(
    route: string | undefined
  ): CompetitionData | undefined {
    if (!route || !route.split('/')[2]) return undefined;
    const competitionUrl = route.split('/')[2];
    const dataWithUrl = (data: CompetitionData) => data.url === competitionUrl;
    const competitionData = SELECT_COMPETITION_DATA_FLAT.find(dataWithUrl);
    return competitionData;
  }
}
