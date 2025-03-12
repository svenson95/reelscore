import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

import { DateString, HttpFixturesService, StateHandler } from '@app/shared';
import { FixtureDTO } from '@lib/models';

type WeekdayFixturesState = StateHandler<{
  weekFixtures: FixtureDTO[][];
}>;

const initialState: WeekdayFixturesState = {
  weekFixtures: Array<Array<FixtureDTO>>(7).fill([]),
  isLoading: false,
  error: null,
};

export const WeekdayFixturesStore = signalStore(
  withState(initialState),
  withMethods((store, http = inject(HttpFixturesService)) => ({
    async loadWeekdayFixtures(date: DateString): Promise<void> {
      patchState(store, { isLoading: true });

      http.getFixtures(date).subscribe({
        next: (dayFixtures) => {
          const weekFixtures = createWeekFixturesArray({ dayFixtures });

          patchState(store, {
            weekFixtures,
            isLoading: false,
          });

          const startOfWeek = new Date(date);
          startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1); // Start of the week (Monday)
          const missingDays = Array.from({ length: 7 }, (_, i) => {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);
            return day.toISOString().split('T')[0];
          }).filter(
            (day) => !weekFixtures.flat().some((f) => f.fixture.date === day)
          );

          missingDays.forEach(async (day) => {
            http.getFixtures(day).subscribe({
              next: (dayFixtures) => {
                if (!dayFixtures.length) return;
                const i = new Date(dayFixtures[0].fixture.date).getDay() - 1;
                const idx = i === -1 ? 6 : i;
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
    async resetWeekdayFixtures(): Promise<void> {
      patchState(store, initialState);
    },
  }))
);

const createWeekFixturesArray = ({
  dayFixtures,
}: {
  dayFixtures: FixtureDTO[];
}): FixtureDTO[][] => {
  return dayFixtures.reduce((acc, fixture) => {
    const weekIdx = new Date(fixture.fixture.date).getDay() - 1;
    const weekStartsOnMonday = (i: number) => (i === -1 ? 6 : i);
    const idx = weekStartsOnMonday(weekIdx);
    acc[idx] = acc[idx] ? [...acc[idx], fixture] : [];
    return acc;
  }, Array<Array<FixtureDTO>>(7).fill([]));
};
