import { inject } from '@angular/core';

import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { retry } from 'rxjs';

import type { GetAllTeamCoachesDTO } from '@reelscore-sdk/models';

import { errorHandler, type StateHandler } from '@app/shared';

import { HttpTeamCoachesService } from '../data-access';

type TeamCoachesState = StateHandler<{
  teamCoaches: GetAllTeamCoachesDTO | null;
}>;

const initialState: TeamCoachesState = {
  teamCoaches: null,
  isLoading: false,
  error: null,
};

export const TeamCoachesStore = signalStore(
  withState(initialState),
  withMethods((store, http = inject(HttpTeamCoachesService)) => {
    let latestRequestId = 0;

    return {
      loadTeamCoaches(teamIds: string, silent = false): void {
        const requestId = ++latestRequestId;
        patchState(store, {
          ...(silent ? {} : { teamCoaches: null }),
          isLoading: !silent,
          error: null,
        });

        http
          .getTeamCoaches(teamIds)
          .pipe(retry(errorHandler))
          .subscribe({
            next: (teamCoaches) => {
              if (requestId !== latestRequestId) return;

              patchState(store, { teamCoaches, isLoading: false, error: null });
            },
            error: (error) => {
              if (requestId !== latestRequestId) return;

              patchState(store, {
                teamCoaches: silent ? store.teamCoaches() : null,
                isLoading: false,
                error,
              });
            },
          });
      },
      reset(): void {
        latestRequestId++;
        patchState(store, initialState);
      },
    };
  })
);
