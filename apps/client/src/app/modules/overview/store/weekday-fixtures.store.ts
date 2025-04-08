import { inject, untracked } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

import { FixturesWeekData } from '@lib/models';

import {
  DateString,
  HttpWeekFixturesService,
  StateHandler,
} from '../../../shared';

type WeekdayFixturesState = StateHandler<{
  weekFixtures: FixturesWeekData;
}>;

const initialState: WeekdayFixturesState = {
  weekFixtures: Array.from({ length: 7 }, () => []),
  isLoading: false,
  error: null,
};

export const WeekdayFixturesStore = signalStore(
  withState(initialState),
  withMethods((store, http = inject(HttpWeekFixturesService)) => ({
    async loadWeekdayFixtures(
      date: DateString,
      updateOnly = false
    ): Promise<void> {
      patchState(store, {
        weekFixtures: updateOnly
          ? untracked(store.weekFixtures)
          : Array.from({ length: 7 }, () => []),
        isLoading: true,
      });

      http.getWeekFixtures(date).subscribe({
        next: async (weekFixtures) => {
          patchState(store, {
            weekFixtures,
            isLoading: false,
          });
        },
        error: (error) =>
          patchState(store, {
            weekFixtures: initialState.weekFixtures,
            isLoading: false,
            error,
          }),
      });
    },
  }))
);
