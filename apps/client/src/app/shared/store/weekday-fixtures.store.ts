import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

import {
  DateString,
  HttpFixturesService,
  StateHandler,
  getMissingDays,
  getWeekDayIndex,
  initWeekDataArray,
} from '@app/shared';
import { FixtureDTO } from '@lib/models';

type WeekdayFixturesState = StateHandler<{
  weekFixtures: FixtureDTO[][];
}>;

const initialState: WeekdayFixturesState = {
  weekFixtures: Array.from({ length: 7 }, () => []),
  isLoading: false,
  error: null,
};

export const WeekdayFixturesStore = signalStore(
  withState(initialState),
  withMethods((store, http = inject(HttpFixturesService)) => ({
    async loadWeekdayFixtures(date: DateString): Promise<void> {
      patchState(store, {
        isLoading: true,
      });

      http.getFixtures(date).subscribe({
        next: (dayFixtures) => {
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

          missingDays.forEach(async (day) => {
            http.getFixtures(day).subscribe({
              next: (dayFixtures) => {
                if (!dayFixtures.length) return;
                const idx = getWeekDayIndex(dayFixtures[0].fixture.date);
                weekFixtures[idx] = dayFixtures;
                patchState(store, { weekFixtures });
              },
            });
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
