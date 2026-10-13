import { inject } from '@angular/core';

import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, EMPTY, pipe, retry, switchMap, tap } from 'rxjs';

import type { CompetitionId, TopScorersDTO } from '@reelscore-sdk/models';

import { errorHandler, type StateHandler } from '@app/shared';

import { HttpTopScorersService } from '../data-access';

type TopScorersState = StateHandler<{
  topScorers: TopScorersDTO | null;
}>;

const initialState: TopScorersState = {
  topScorers: null,
  isLoading: false,
  error: null,
};

export const TopScorersStore = signalStore(
  withState(initialState),
  withMethods((store, http = inject(HttpTopScorersService)) => {
    let activeCompetitionId: CompetitionId | null = null;

    const load = rxMethod<CompetitionId>(
      pipe(
        tap((id) => {
          const competitionChanged = activeCompetitionId !== id;
          activeCompetitionId = id;

          patchState(store, {
            ...(competitionChanged ? { topScorers: null } : {}),
            isLoading: true,
            error: null,
          });
        }),
        switchMap((id) =>
          http.getTopScorersForCompetition(id).pipe(
            retry(errorHandler),
            tap((topScorers) =>
              patchState(store, {
                topScorers,
                isLoading: false,
                error: topScorers ? null : 'TopScorers not found',
              })
            ),
            catchError((error) => {
              patchState(store, { topScorers: null, isLoading: false, error });
              return EMPTY;
            })
          )
        )
      )
    );

    return {
      loadTopScorers(id: CompetitionId): void {
        load(id);
      },
    };
  })
);
