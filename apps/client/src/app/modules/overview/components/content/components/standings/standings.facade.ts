import { computed, inject, Injectable } from '@angular/core';

import { hasMultipleGroups, showHomeAndAwayStandings } from '@app/shared';

import { FilterService } from '../../../../services';
import { FilteredStandingsStore } from '../../../../store';

@Injectable()
export class OverviewStandingsFacade {
  readonly standingsStore = inject(FilteredStandingsStore);
  readonly dayStandings = this.standingsStore.standings;

  private readonly filterService = inject(FilterService);
  readonly isFiltering = this.filterService.isFiltering;

  readonly hasMultipleGroups = computed<boolean>(() => {
    const standings = this.dayStandings();
    if (standings === null) return false;

    return hasMultipleGroups(standings);
  });

  readonly showHomeAndAwayStandings = computed<boolean>(() => {
    const standings = this.dayStandings();
    if (standings === null) return false;

    return showHomeAndAwayStandings(standings);
  });
}
