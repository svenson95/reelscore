import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

import { DateString, HttpStandingsService, StateHandler } from '@app/shared';
import { StandingsWeekData } from '@lib/models';

type WeekdayStandingsState = StateHandler<{
  weekStandings: StandingsWeekData;
}>;

const initialState: WeekdayStandingsState = {
  weekStandings: Array.from({ length: 7 }, () => []),
  isLoading: false,
  error: null,
};

export const WeekdayStandingsStore = signalStore(
  withState(initialState),
  withMethods((store, http = inject(HttpStandingsService)) => ({
    async loadWeekdayStandings(
      date: DateString,
      updateOnly = false
    ): Promise<void> {
      patchState(store, {
        weekStandings: updateOnly
          ? store.weekStandings()
          : Array.from({ length: 7 }, () => []),
        isLoading: true,
      });

      http.getWeekStandings(date).subscribe({
        next: async (weekStandings) => {
          patchState(store, {
            weekStandings,
            isLoading: false,
          });
        },
        error: (error) =>
          patchState(store, {
            weekStandings: initialState.weekStandings,
            isLoading: false,
            error,
          }),
      });
    },
  }))
);
