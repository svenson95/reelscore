import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, EMPTY, pipe, retry, switchMap, tap } from 'rxjs';

import { errorHandler, HttpStandingsService } from '@app/shared';
import type { StandingsWeekData } from '@lib/models';
import type { DateString } from '@lib/shared';

import {
  getWeekRequestStartPatch,
  WEEK_REQUEST_END_PATCH,
  withWeekRequestState,
} from './week-request.feature';

type WeekdayStandingsState = {
  weekStandings: StandingsWeekData;
};

type LoadWeekdayStandingsParams = {
  date: DateString;
  updateOnly: boolean;
};

const initialState: WeekdayStandingsState = {
  weekStandings: createEmptyWeekStandings(),
};

export const WeekdayStandingsStore = signalStore(
  withState(initialState),
  withWeekRequestState(),

  withMethods((store, http = inject(HttpStandingsService)) => {
    const load = rxMethod<LoadWeekdayStandingsParams>(
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
                  : { weekStandings: createEmptyWeekStandings() }),
              });

              return EMPTY;
            })
          )
        )
      )
    );

    return {
      loadWeekdayStandings(date: DateString, updateOnly = false): void {
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
