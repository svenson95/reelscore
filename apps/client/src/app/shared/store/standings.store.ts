import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

import { CompetitionId, StandingsDTO } from '@lib/models';
import { DateString } from '../constants';
import { StateHandler } from '../models';
import { HttpStandingsService } from '../services/http/standings.service';

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

      http.getStandings(id, date).subscribe({
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
