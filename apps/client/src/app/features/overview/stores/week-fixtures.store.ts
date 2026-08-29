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

      updateFixtures(fixtures: FixtureDTO[]): void {
        if (fixtures.length === 0) {
          return;
        }

        const fixturesById = new Map(
          fixtures.map((fixture) => [fixture.fixture.id, fixture])
        );

        const currentWeekFixtures = store.weekFixtures();

        const hasRelevantFixture = currentWeekFixtures.some((dayFixtures) =>
          dayFixtures.some((fixture) => fixturesById.has(fixture.fixture.id))
        );

        if (!hasRelevantFixture) {
          return;
        }

        patchState(store, {
          weekFixtures: currentWeekFixtures.map((dayFixtures) =>
            dayFixtures.map((currentFixture) => {
              const fixture = fixturesById.get(currentFixture.fixture.id);

              return fixture
                ? {
                    ...currentFixture,
                    ...fixture,
                  }
                : currentFixture;
            })
          ),
        });
      },
    };
  })
);

function createEmptyWeekFixtures(): FixturesWeekData {
  return Array.from({ length: 9 }, () => []);
}
