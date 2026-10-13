import { inject } from '@angular/core';

import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, EMPTY, pipe, retry, switchMap, tap } from 'rxjs';

import type { CompetitionId, TopAssistsDTO } from '@reelscore-sdk/models';

import { errorHandler, type StateHandler } from '@app/shared';

import { HttpTopAssistsService } from '../data-access';

type TopAssistsState = StateHandler<{
  topAssists: TopAssistsDTO | null;
}>;

const initialState: TopAssistsState = {
  topAssists: null,
  isLoading: false,
  error: null,
};

export const TopAssistsStore = signalStore(
  withState(initialState),
  withMethods((store, http = inject(HttpTopAssistsService)) => {
    let activeCompetitionId: CompetitionId | null = null;

    const load = rxMethod<CompetitionId>(
      pipe(
        tap((id) => {
          const competitionChanged = activeCompetitionId !== id;
          activeCompetitionId = id;

          patchState(store, {
            ...(competitionChanged ? { topAssists: null } : {}),
            isLoading: true,
            error: null,
          });
        }),
        switchMap((id) =>
          http.getTopAssistsForCompetition(id).pipe(
            retry(errorHandler),
            tap((topAssists) =>
              patchState(store, {
                topAssists,
                isLoading: false,
                error: topAssists ? null : 'TopAssists not found',
              })
            ),
            catchError((error) => {
              patchState(store, { topAssists: null, isLoading: false, error });
              return EMPTY;
            })
          )
        )
      )
    );

    return {
      loadTopAssists(id: CompetitionId): void {
        load(id);
      },
    };
  })
);
