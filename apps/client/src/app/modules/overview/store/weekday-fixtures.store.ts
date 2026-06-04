import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { retry } from 'rxjs';

import {
  errorHandler,
  HttpWeekFixturesService,
  type StateHandler,
} from '@app/shared';
import type { FixturesWeekData } from '@lib/models';
import type { DateString } from '@lib/shared';

type WeekdayFixturesState = StateHandler<{
  weekFixtures: FixturesWeekData;
  isRefreshing: boolean;
}>;

const initialState: WeekdayFixturesState = {
  weekFixtures: createEmptyWeekFixtures(),
  isLoading: false,
  isRefreshing: false,
  error: null,
};

export const WeekdayFixturesStore = signalStore(
  withState(initialState),
  withMethods((store, http = inject(HttpWeekFixturesService)) => ({
    loadWeekdayFixtures(date: DateString, updateOnly = false): void {
      patchState(store, {
        error: null,
        isLoading: !updateOnly,
        isRefreshing: updateOnly,
        ...(updateOnly ? {} : { weekFixtures: createEmptyWeekFixtures() }),
      });

      http
        .getWeekFixtures(date)
        .pipe(retry(errorHandler))
        .subscribe({
          next: (weekFixtures) => {
            patchState(store, {
              weekFixtures,
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
                : { weekFixtures: createEmptyWeekFixtures() }),
            });
          },
        });
    },
  }))
);

function createEmptyWeekFixtures(): FixturesWeekData {
  return Array.from({ length: 7 }, () => []);
}
