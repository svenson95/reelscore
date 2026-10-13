import { inject } from '@angular/core';

import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, EMPTY, pipe, retry, switchMap, tap } from 'rxjs';

import type { CompetitionId, ExtendedFixtureDTO } from '@reelscore-sdk/models';

import type { StateHandler } from '@app/shared';
import { errorHandler } from '@app/shared';

import { HttpLastFixturesService } from '../data-access';

type LastFixturesState = StateHandler<{
  fixtures: ExtendedFixtureDTO[][] | null;
  showAll: boolean;
}>;

const initialState: LastFixturesState = {
  fixtures: null,
  showAll: false,
  isLoading: false,
  error: null,
};

export const LastFixturesStore = signalStore(
  withState(initialState),
  withMethods((store, http = inject(HttpLastFixturesService)) => {
    let activeCompetitionId: CompetitionId | null = null;

    const load = rxMethod<{ id: CompetitionId; showAll: boolean }>(
      pipe(
        tap(({ id, showAll }) => {
          const competitionChanged = activeCompetitionId !== id;
          activeCompetitionId = id;

          patchState(store, {
            ...(competitionChanged ? { fixtures: null } : {}),
            isLoading: true,
            error: null,
            showAll,
          });
        }),
        switchMap(({ id, showAll }) =>
          http.getLastFixturesForCompetition(id, showAll).pipe(
            retry(errorHandler),
            tap((fixtures) =>
              patchState(store, {
                fixtures,
                isLoading: false,
                error: fixtures ? null : 'Last Fixtures not found',
              })
            ),
            catchError((error) => {
              patchState(store, { fixtures: null, isLoading: false, error });
              return EMPTY;
            })
          )
        )
      )
    );

    return {
      loadLastFixtures(id: CompetitionId, showAll = false): void {
        load({ id, showAll });
      },
    };
  })
);
