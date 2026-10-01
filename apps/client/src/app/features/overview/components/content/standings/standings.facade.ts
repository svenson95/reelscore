import { computed, inject, Injectable } from '@angular/core';

import { isCompetitionWithMultipleGroups } from '@reelscore-sdk/helpers';

import { showHomeAndAwayStandings } from '@app/shared';

import { FilterService } from '../../../services';
import { FilteredStandingsStore } from '../../../stores';

@Injectable()
export class OverviewStandingsFacade {
  readonly standingsStore = inject(FilteredStandingsStore);
  readonly dayStandings = this.standingsStore.standings;

  private readonly filterService = inject(FilterService);
  readonly isFiltering = this.filterService.isFiltering;

  readonly hasMultipleGroups = computed<boolean>(() => {
    const standings = this.dayStandings();
    if (standings === null) return false;

    return isCompetitionWithMultipleGroups(
      standings.league.id,
      standings.league.season
    );
  });

  readonly showHomeAndAwayStandings = computed<boolean>(() => {
    const standings = this.dayStandings();
    if (standings === null) return false;

    return showHomeAndAwayStandings(standings);
  });
}
