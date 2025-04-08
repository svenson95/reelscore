import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

import { CompetitionId, StandingsDTO } from '@lib/models';

import { DateString } from '../../../shared/constants';
import { StateHandler } from '../../../shared/models';
import { HttpStandingsService } from '../../../shared/services';

type FilteredStandingsState = StateHandler<{ standings: StandingsDTO | null }>;

const initialState: FilteredStandingsState = {
  isLoading: false,
  error: null,
  standings: null,
};

export const FilteredStandingsStore = signalStore(
  withState(initialState),
  withMethods((store, http = inject(HttpStandingsService)) => ({
    async loadFilteredStandings(
      date: DateString,
      id: CompetitionId
    ): Promise<void> {
      patchState(store, { isLoading: true });

      http.getStandings(id, date).subscribe({
        next: (standings) =>
          patchState(store, {
            standings,
            isLoading: false,
            error: standings ? null : 'Filtered Standings not found',
          }),
        error: (error) =>
          patchState(store, {
            standings: null,
            isLoading: false,
            error,
          }),
      });
    },
    reset(): void {
      patchState(store, initialState);
    },
  }))
);
