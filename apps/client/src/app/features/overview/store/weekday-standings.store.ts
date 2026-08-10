import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { retry } from 'rxjs';

import {
  errorHandler,
  HttpStandingsService,
  type StateHandler,
} from '@app/shared';
import type { StandingsWeekData } from '@lib/models';
import type { DateString } from '@lib/shared';

type WeekdayStandingsState = StateHandler<{
  weekStandings: StandingsWeekData;
  isRefreshing: boolean;
}>;

const initialState: WeekdayStandingsState = {
  weekStandings: createEmptyWeekStandings(),
  isLoading: false,
  isRefreshing: false,
  error: null,
};

export const WeekdayStandingsStore = signalStore(
  withState(initialState),
  withMethods((store, http = inject(HttpStandingsService)) => ({
    loadWeekdayStandings(date: DateString, updateOnly = false): void {
      patchState(store, {
        error: null,
        isLoading: !updateOnly,
        isRefreshing: updateOnly,
        ...(updateOnly ? {} : { weekStandings: createEmptyWeekStandings() }),
      });

      http
        .getWeekStandings(date)
        .pipe(retry(errorHandler))
        .subscribe({
          next: (weekStandings) => {
            patchState(store, {
              weekStandings,
              isLoading: false,
              isRefreshing: false,
              error: null,
            });
          },
          error: (error) => {
            patchState(store, {
              isLoading: false,
              isRefreshing: false,
              error,
              ...(updateOnly
                ? {}
                : { weekStandings: createEmptyWeekStandings() }),
            });
          },
        });
    },
  }))
);

function createEmptyWeekStandings(): StandingsWeekData {
  return Array.from({ length: 7 }, () => []);
}
