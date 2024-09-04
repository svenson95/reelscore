import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

import { DateString, StateHandler } from '@app/models';
import { HttpStandingsService } from '@app/services';
import { StandingsDTO } from '@lib/models';

type StandingsState = StateHandler<{ standings: StandingsDTO[] | null }>;

const initialState: StandingsState = {
  standings: null,
  isLoading: false,
  error: null,
};

export const StandingsStore = signalStore(
  withState(initialState),
  withMethods((store, http = inject(HttpStandingsService)) => ({
    async loadStandings(date: DateString): Promise<void> {
      patchState(store, { isLoading: true });

      http.getAllStandings(date).subscribe({
        next: (standings) =>
          patchState(store, {
            standings,
            isLoading: false,
            error: standings ? null : 'Standings not found',
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
