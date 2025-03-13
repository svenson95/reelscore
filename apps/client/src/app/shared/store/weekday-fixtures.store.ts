import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

import {
  DateString,
  HttpFixturesService,
  WeekStateHandler,
  getMissingDays,
  getWeekDayIndex,
  initWeekDataArray,
} from '@app/shared';
import { FixtureDTO } from '@lib/models';

type WeekdayFixturesState = WeekStateHandler<{
  weekFixtures: FixtureDTO[][];
}>;

const initialState: WeekdayFixturesState = {
  weekFixtures: Array.from({ length: 7 }, () => []),
  isLoading: false,
  isPreloading: false,
  error: null,
};

export const WeekdayFixturesStore = signalStore(
  withState(initialState),
  withMethods((store, http = inject(HttpFixturesService)) => ({
    async loadWeekdayFixtures(date: DateString): Promise<void> {
      patchState(store, {
        weekFixtures: Array.from({ length: 7 }, () => []),
        isLoading: true,
        isPreloading: true,
      });

      http.getFixtures(date).subscribe({
        next: async (dayFixtures) => {
          const weekFixtures = initWeekDataArray<FixtureDTO>({
            dayData: dayFixtures,
            date,
          });

          patchState(store, {
            weekFixtures,
            isLoading: false,
          });

          const missingDays = getMissingDays({ date }).filter(
            (day) => !weekFixtures.flat().some((f) => f.fixture.date === day)
          );

          const missingDaysFixtures = await Promise.all(
            missingDays.map((day) => http.getFixtures(day).toPromise())
          );

          missingDaysFixtures.forEach((dayFixtures, index) => {
            if (dayFixtures?.length) {
              const idx = getWeekDayIndex(missingDays[index]);
              weekFixtures[idx] = dayFixtures;
            }
          });

          patchState(store, { weekFixtures, isPreloading: false });
        },
        error: (error) =>
          patchState(store, {
            weekFixtures: initialState.weekFixtures,
            isLoading: false,
            isPreloading: false,
            error,
          }),
      });
    },
  }))
);
