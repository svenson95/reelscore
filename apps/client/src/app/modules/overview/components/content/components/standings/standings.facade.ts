import { computed, inject, Injectable } from '@angular/core';

import { isCompetitionWithMultipleGroups } from '@lib/shared';

import { FilterService } from '../../../../services';
import { FilteredStandingsStore } from '../../../../store';

@Injectable()
export class OverviewStandingsFacade {
  standingsStore = inject(FilteredStandingsStore);
  dayStandings = this.standingsStore.standings;

  filterService = inject(FilterService);
  isFiltering = computed<boolean>(
    () =>
      this.filterService.selectedCompetition() !== null &&
      this.dayStandings() !== null
  );

  hasMultipleGroups = computed<boolean>(() => {
    const standings = this.dayStandings();
    if (!standings) return false;
    return isCompetitionWithMultipleGroups(standings.league.id);
  });

  showHomeAndAwayStandings = computed<boolean>(() => {
    const standings = this.dayStandings();
    if (!standings) return false;
    return standings.league.standings?.length === 3;
  });
}
