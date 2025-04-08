import { computed, inject, Injectable } from '@angular/core';

import { isCompetitionWithMultipleGroups } from '@lib/shared';

import { FilteredStandingsStore } from '../../../../store';
import { FilterService } from '../../../../services';

@Injectable()
export class OverviewStandingsFacade {
  standingsStore = inject(FilteredStandingsStore);
  dayStandings = this.standingsStore.standings;

  filterService = inject(FilterService);
  isFilwtering = computed<boolean>(
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
