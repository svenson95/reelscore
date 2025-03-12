import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

import { DateString, HttpStandingsService, StateHandler } from '@app/shared';
import { StandingsDTO } from '@lib/models';

type WeekdayStandingsState = StateHandler<{
  weekStandings: StandingsDTO[][];
}>;

const initialState: WeekdayStandingsState = {
  weekStandings: Array<Array<StandingsDTO>>(7).fill([]),
  isLoading: false,
  error: null,
};

export const WeekdayStandingsStore = signalStore(
  withState(initialState),
  withMethods((store, http = inject(HttpStandingsService)) => ({
    async loadWeekdayStandings(date: DateString): Promise<void> {
      patchState(store, { isLoading: true });

      http.getAllStandings(date).subscribe({
        next: (dayStandings) => {
          const weekStandings = createWeekStandingsArray({
            dayStandings,
            date,
          });

          patchState(store, {
            weekStandings,
            isLoading: false,
          });

          const startOfWeek = new Date(date);
          startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1); // Start of the week (Monday)
          const missingDays = Array.from({ length: 7 }, (_, i) => {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);
            return day.toISOString().split('T')[0];
          }).filter((day) => date !== day);

          missingDays.forEach(async (day) => {
            http.getAllStandings(day).subscribe({
              next: (dayStandings) => {
                if (!dayStandings.length) return;
                const i = new Date(day).getDay() - 1;
                const idx = i === -1 ? 6 : i;
                weekStandings[idx] = dayStandings;
                patchState(store, { weekStandings });
              },
            });
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
    async resetWeekdayStandings(): Promise<void> {
      patchState(store, initialState);
    },
  }))
);

const createWeekStandingsArray = ({
  dayStandings,
  date,
}: {
  dayStandings: StandingsDTO[];
  date: DateString;
}): StandingsDTO[][] => {
  return dayStandings.reduce((acc, fixture) => {
    const weekIdx = new Date(date).getDay() - 1;
    const weekStartsOnMonday = (i: number) => (i === -1 ? 6 : i);
    const idx = weekStartsOnMonday(weekIdx);
    acc[idx] = acc[idx] ? [...acc[idx], fixture] : [];
    return acc;
  }, Array<Array<StandingsDTO>>(7).fill([]));
};
