import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, EMPTY, pipe, retry, switchMap, tap } from 'rxjs';

import { errorHandler, HttpWeekFixturesService } from '@app/shared';
import type { FixtureDTO, FixturesWeekData } from '@lib/models';
import { formatCalendarWeekKey, type DateString } from '@lib/shared';

import {
  getWeekRequestStartPatch,
  WEEK_REQUEST_END_PATCH,
  withWeekRequestState,
} from './week-request.feature';

type WeekFixturesState = {
  weekFixtures: FixturesWeekData;
};

type LoadWeekFixturesParams = {
  date: DateString;
  updateOnly: boolean;
};

const initialState: WeekFixturesState = {
  weekFixtures: createEmptyWeekFixtures(),
};

export const WeekFixturesStore = signalStore(
  withState(initialState),
  withWeekRequestState(),

  withMethods((store, http = inject(HttpWeekFixturesService)) => {
    const load = rxMethod<LoadWeekFixturesParams>(
      pipe(
        tap(({ updateOnly }) => {
          patchState(store, {
            ...getWeekRequestStartPatch(updateOnly),
          });
        }),

        switchMap(({ date }) =>
          http.getWeekFixtures(date).pipe(
            retry(errorHandler),

            tap((weekFixtures) => {
              patchState(store, {
                weekFixtures,
                weekKey: formatCalendarWeekKey(date),
                ...WEEK_REQUEST_END_PATCH,
                error: null,
              });
            }),

            catchError((error) => {
              patchState(store, {
                ...WEEK_REQUEST_END_PATCH,
                error,
              });

              return EMPTY;
            })
          )
        )
      )
    );

    return {
      loadWeekFixtures(date: DateString, updateOnly = false): void {
        load({
          date,
          updateOnly,
        });
      },

      updateFixture(fixture: FixtureDTO): void {
        patchState(store, {
          weekFixtures: store.weekFixtures().map((dayFixtures) =>
            dayFixtures.map((currentFixture) =>
              currentFixture.fixture.id === fixture.fixture.id
                ? {
                    ...currentFixture,
                    ...fixture,
                  }
                : currentFixture
            )
          ),
        });
      },
    };
  })
);

function createEmptyWeekFixtures(): FixturesWeekData {
  return Array.from({ length: 9 }, () => []);
}
