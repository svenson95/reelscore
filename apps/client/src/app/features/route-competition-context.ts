import { effect, inject } from '@angular/core';

import type { CompetitionData } from '@app/shared';
import {
  LeagueService,
  RouteService,
  SELECT_COMPETITION_DATA_FLAT,
} from '@app/shared';

export class RouteCompetitionContext {
  private readonly routeService = inject(RouteService);

  readonly leagueService = inject(LeagueService);

  private readonly routeEvent = effect(() =>
    this.updateCompetition(this.routeService.url())
  );

  private updateCompetition(route: string | undefined): void {
    const competitionData = this.findCompetitionData(route);
    this.leagueService.setSelectedLeague(competitionData);
  }

  private findCompetitionData(
    route: string | undefined
  ): CompetitionData | undefined {
    if (!route || !route.split('/')[2]) return undefined;
    const competitionUrl = route.split('/')[2];
    const dataWithUrl = (data: CompetitionData) => data.url === competitionUrl;
    const competitionData = SELECT_COMPETITION_DATA_FLAT.find(dataWithUrl);
    return competitionData;
  }
}
