import { DestroyRef, effect, inject } from '@angular/core';

import {
  type CompetitionData,
  LeagueService,
  RouteService,
  SELECT_COMPETITION_DATA_FLAT,
} from '@app/shared';

export class CompetitionRouteContext {
  private readonly routeService = inject(RouteService);
  private readonly routeLeagueService = inject(LeagueService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly routeEffect = effect(() => {
    const competition = this.findCompetition(this.routeService.url());

    this.routeLeagueService.setSelectedLeague(competition);
  });

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.routeLeagueService.setSelectedLeague(undefined);
    });
  }

  private findCompetition(
    route: string | undefined
  ): CompetitionData | undefined {
    const competitionUrl = route?.split('/')[2];

    if (!competitionUrl) return undefined;

    return SELECT_COMPETITION_DATA_FLAT.find((c) => c.url === competitionUrl);
  }
}
