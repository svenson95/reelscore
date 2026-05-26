import { computed, inject, Injectable } from '@angular/core';

import { hasMultipleGroups, showHomeAndAwayStandings } from '@app/shared';

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

  hasMultipleGroups = computed<boolean>(() =>
    hasMultipleGroups(this.dayStandings())
  );

  showHomeAndAwayStandings = computed<boolean>(() =>
    showHomeAndAwayStandings(this.dayStandings())
  );
}
