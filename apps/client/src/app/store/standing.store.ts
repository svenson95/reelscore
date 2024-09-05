import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

import { DateString, StateHandler } from '@app/models';
import { HttpStandingsService } from '@app/services';
import { CompetitionId, StandingsDTO } from '@lib/models';

type StandingState = StateHandler<{ standing: StandingsDTO | null }>;

const initialState: StandingState = {
  isLoading: false,
  error: null,
  standing: null,
};

export const StandingStore = signalStore(
  withState(initialState),
  withMethods((store, http = inject(HttpStandingsService)) => ({
    async loadStanding(date: DateString, id: CompetitionId): Promise<void> {
      patchState(store, { isLoading: true });

      http.getStandings(date, id).subscribe({
        next: (standing) =>
          patchState(store, {
            standing,
            isLoading: false,
            error: standing ? null : 'Standing not found',
          }),
        error: (error) =>
          patchState(store, {
            standing: null,
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
