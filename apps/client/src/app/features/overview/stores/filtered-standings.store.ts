import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, EMPTY, pipe, retry, switchMap, tap } from 'rxjs';

import {
  errorHandler,
  HttpStandingsService,
  type StateHandler,
} from '@app/shared';
import type { CompetitionId, StandingsDTO } from '@lib/models';
import type { DateString } from '@lib/shared';

type FilteredStandingsState = StateHandler<{
  standings: StandingsDTO | null;
}>;

type FilteredStandingsAction =
  | {
      type: 'load';
      date: DateString;
      id: CompetitionId;
    }
  | {
      type: 'reset';
    };

const initialState: FilteredStandingsState = {
  isLoading: false,
  error: null,
  standings: null,
};

export const FilteredStandingsStore = signalStore(
  withState(initialState),

  withMethods((store, http = inject(HttpStandingsService)) => {
    const dispatch = rxMethod<FilteredStandingsAction>(
      pipe(
        switchMap((action) => {
          if (action.type === 'reset') {
            patchState(store, initialState);
            return EMPTY;
          }

          patchState(store, {
            isLoading: true,
            error: null,
          });

          return http.getStandings(action.id, action.date).pipe(
            retry(errorHandler),

            tap((standings) => {
              patchState(store, {
                standings,
                isLoading: false,
                error: standings ? null : 'Filtered Standings not found',
              });
            }),

            catchError((error) => {
              patchState(store, {
                standings: null,
                isLoading: false,
                error,
              });

              return EMPTY;
            })
          );
        })
      )
    );

    return {
      loadFilteredStandings(date: DateString, id: CompetitionId): void {
        dispatch({
          type: 'load',
          date,
          id,
        });
      },

      reset(): void {
        dispatch({
          type: 'reset',
        });
      },
    };
  })
);
