import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, EMPTY, pipe, retry, switchMap, tap } from 'rxjs';

import { errorHandler, HttpStandingsService } from '@app/shared';
import type { StandingsWeekData } from '@lib/models';
import { formatCalendarWeekKey, type DateString } from '@lib/shared';

import {
  getWeekRequestStartPatch,
  WEEK_REQUEST_END_PATCH,
  withWeekRequestState,
} from './week-request.feature';

type WeekStandingsState = {
  weekStandings: StandingsWeekData;
};

type LoadWeekStandingsParams = {
  date: DateString;
  updateOnly: boolean;
};

const initialState: WeekStandingsState = {
  weekStandings: createEmptyWeekStandings(),
};

export const WeekStandingsStore = signalStore(
  withState(initialState),
  withWeekRequestState(),

  withMethods((store, http = inject(HttpStandingsService)) => {
    const load = rxMethod<LoadWeekStandingsParams>(
      pipe(
        tap(({ updateOnly }) => {
          patchState(store, {
            ...getWeekRequestStartPatch(updateOnly),
            ...(updateOnly
              ? {}
              : { weekStandings: createEmptyWeekStandings() }),
          });
        }),

        switchMap(({ date, updateOnly }) =>
          http.getWeekStandings(date).pipe(
            retry(errorHandler),

            tap((weekStandings) => {
              patchState(store, {
                weekKey: formatCalendarWeekKey(date),
                weekStandings,
                ...WEEK_REQUEST_END_PATCH,
                error: null,
              });
            }),

            catchError((error) => {
              patchState(store, {
                ...WEEK_REQUEST_END_PATCH,
                error,
                ...(updateOnly
                  ? {}
                  : {
                      weekKey: null,
                      weekStandings: createEmptyWeekStandings(),
                    }),
              });

              return EMPTY;
            })
          )
        )
      )
    );

    return {
      loadWeekStandings(date: DateString, updateOnly = false): void {
        load({
          date,
          updateOnly,
        });
      },
    };
  })
);

function createEmptyWeekStandings(): StandingsWeekData {
  return Array.from({ length: 7 }, () => []);
}
