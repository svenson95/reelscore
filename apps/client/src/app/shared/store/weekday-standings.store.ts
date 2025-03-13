import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

import {
  DateString,
  HttpStandingsService,
  StateHandler,
  getMissingDays,
  getWeekDayIndex,
  initWeekDataArray,
} from '@app/shared';
import { StandingsDTO } from '@lib/models';

type WeekdayStandingsState = StateHandler<{
  weekStandings: StandingsDTO[][];
}>;

const initialState: WeekdayStandingsState = {
  weekStandings: Array.from({ length: 7 }, () => []),
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
          const weekStandings = initWeekDataArray<StandingsDTO>({
            dayData: dayStandings,
            date,
          });

          patchState(store, {
            weekStandings,
            isLoading: false,
          });

          const missingDays = getMissingDays({ date }).filter(
            (day) => date !== day
          );

          missingDays.forEach(async (day) => {
            http.getAllStandings(day).subscribe({
              next: (dayStandings) => {
                if (!dayStandings.length) return;
                const idx = getWeekDayIndex(day);
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
  }))
);
