import { inject } from '@angular/core';

import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, EMPTY, pipe, retry, switchMap, tap } from 'rxjs';

import type { DateString } from '@reelscore-sdk/helpers';
import type { CompetitionId, StandingsDTO } from '@reelscore-sdk/models';

import {
  errorHandler,
  HttpStandingsService,
  type StateHandler,
} from '@app/shared';

type CompetitionStandingsState = StateHandler<{
  standings: StandingsDTO | null;
}>;

const initialState: CompetitionStandingsState = {
  standings: null,
  isLoading: false,
  error: null,
};

export const CompetitionStandingsStore = signalStore(
  withState(initialState),
  withMethods((store, http = inject(HttpStandingsService)) => {
    let activeCompetitionId: CompetitionId | null = null;

    const load = rxMethod<{ id: CompetitionId; date: DateString }>(
      pipe(
        tap(({ id }) => {
          const competitionChanged = activeCompetitionId !== id;
          activeCompetitionId = id;

          patchState(store, {
            ...(competitionChanged ? { standings: null } : {}),
            isLoading: true,
            error: null,
          });
        }),
        switchMap(({ id, date }) =>
          http.getStandings(id, date).pipe(
            retry(errorHandler),
            tap((standings) =>
              patchState(store, {
                standings,
                isLoading: false,
                error: standings ? null : 'CompetitionStandings not found',
              })
            ),
            catchError((error) => {
              patchState(store, { standings: null, isLoading: false, error });
              return EMPTY;
            })
          )
        )
      )
    );

    return {
      loadStandings(id: CompetitionId, date: DateString): void {
        load({ id, date });
      },
    };
  })
);
