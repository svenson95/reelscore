import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, EMPTY, pipe, retry, switchMap, tap } from 'rxjs';

import { errorHandler, HttpWeekFixturesService } from '@app/shared';
import type { FixturesWeekData } from '@lib/models';
import type { DateString } from '@lib/shared';

import {
  getWeekRequestStartPatch,
  WEEK_REQUEST_END_PATCH,
  withWeekRequestState,
} from './week-request.feature';

type WeekdayFixturesState = {
  weekFixtures: FixturesWeekData;
};

type LoadWeekdayFixturesParams = {
  date: DateString;
  updateOnly: boolean;
};

const initialState: WeekdayFixturesState = {
  weekFixtures: createEmptyWeekFixtures(),
};

export const WeekdayFixturesStore = signalStore(
  withState(initialState),
  withWeekRequestState(),

  withMethods((store, http = inject(HttpWeekFixturesService)) => {
    const load = rxMethod<LoadWeekdayFixturesParams>(
      pipe(
        tap(({ updateOnly }) => {
          patchState(store, {
            ...getWeekRequestStartPatch(updateOnly),
            ...(updateOnly ? {} : { weekFixtures: createEmptyWeekFixtures() }),
          });
        }),

        switchMap(({ date, updateOnly }) =>
          http.getWeekFixtures(date).pipe(
            retry(errorHandler),

            tap((weekFixtures) => {
              patchState(store, {
                weekFixtures,
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
                  : { weekFixtures: createEmptyWeekFixtures() }),
              });

              return EMPTY;
            })
          )
        )
      )
    );

    return {
      loadWeekdayFixtures(date: DateString, updateOnly = false): void {
        load({
          date,
          updateOnly,
        });
      },
    };
  })
);

function createEmptyWeekFixtures(): FixturesWeekData {
  return Array.from({ length: 7 }, () => []);
}
