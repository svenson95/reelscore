import { inject } from '@angular/core';

import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, EMPTY, pipe, retry, switchMap, tap } from 'rxjs';

import type { CompetitionId, ExtendedFixtureDTO } from '@reelscore-sdk/models';

import { errorHandler, type StateHandler } from '@app/shared';

import { HttpNextFixturesService } from '../data-access';

type NextFixturesState = StateHandler<{
  fixtures: ExtendedFixtureDTO[][] | null;
}>;

const initialState: NextFixturesState = {
  fixtures: null,
  isLoading: false,
  error: null,
};

export const NextFixturesStore = signalStore(
  withState(initialState),
  withMethods((store, http = inject(HttpNextFixturesService)) => {
    let activeCompetitionId: CompetitionId | null = null;

    const load = rxMethod<CompetitionId>(
      pipe(
        tap((id) => {
          const competitionChanged = activeCompetitionId !== id;
          activeCompetitionId = id;

          patchState(store, {
            ...(competitionChanged ? { fixtures: null } : {}),
            isLoading: true,
            error: null,
          });
        }),
        switchMap((id) =>
          http.getNextFixturesForCompetition(id).pipe(
            retry(errorHandler),
            tap((fixtures) =>
              patchState(store, {
                fixtures,
                isLoading: false,
                error: fixtures ? null : 'Next Fixtures not found',
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
      loadNextFixtures(id: CompetitionId): void {
        load(id);
      },
    };
  })
);
