import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

import { HttpStandingsService, StateHandler } from '@app/shared';
import { CompetitionId, StandingsDTO } from '@lib/models';

type CompetitionStandingsState = StateHandler<{
  standings: StandingsDTO | null;
}>;

const initialState: CompetitionStandingsState = {
  standings: null,
  isLoading: false,
  error: null,
};

export const CompetitionStandingsStore = signalStore(
  withState(initialState),
  withMethods((store, http = inject(HttpStandingsService)) => ({
    async loadStandings(id: CompetitionId): Promise<void> {
      patchState(store, { isLoading: true });

      http.getStandings(id).subscribe({
        next: (standings) =>
          patchState(store, {
            standings,
            isLoading: false,
            error: standings ? null : 'CompetitionStandings not found',
          }),
        error: (error) =>
          patchState(store, {
            standings: null,
            isLoading: false,
            error,
          }),
      });
    },
  }))
);
