import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

import { DateString, StateHandler } from '@app/models';
import { HttpStandingsService } from '@app/services';
import { CompetitionId, StandingsDTO } from '@lib/models';

type StandingsState = StateHandler<{ standings: StandingsDTO | null }>;

const initialState: StandingsState = {
  isLoading: false,
  error: null,
  standings: null,
};

export const StandingsStore = signalStore(
  withState(initialState),
  withMethods((store, http = inject(HttpStandingsService)) => ({
    async loadStanding(date: DateString, id: CompetitionId): Promise<void> {
      patchState(store, { isLoading: true });

      http.getStandings(date, id).subscribe({
        next: (standings) =>
          patchState(store, {
            standings,
            isLoading: false,
            error: standings ? null : 'Standing not found',
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
