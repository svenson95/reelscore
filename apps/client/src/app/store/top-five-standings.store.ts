import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

import { DateString } from '@app/constants';
import { StateHandler } from '@app/models';
import { HttpStandingsService } from '@app/services';
import { StandingsDTO } from '@lib/models';

type TopFiveStandingsState = StateHandler<{
  topFiveStandings: StandingsDTO[] | null;
}>;

const initialState: TopFiveStandingsState = {
  topFiveStandings: null,
  isLoading: false,
  error: null,
};

export const TopFiveStandingsStore = signalStore(
  withState(initialState),
  withMethods((store, http = inject(HttpStandingsService)) => ({
    async loadStandings(date: DateString): Promise<void> {
      patchState(store, { isLoading: true });

      http.getAllStandings(date).subscribe({
        next: (topFiveStandings) =>
          patchState(store, {
            topFiveStandings,
            isLoading: false,
            error: topFiveStandings ? null : 'TopFiveStandings not found',
          }),
        error: (error) =>
          patchState(store, {
            topFiveStandings: null,
            isLoading: false,
            error,
          }),
      });
    },
  }))
);
