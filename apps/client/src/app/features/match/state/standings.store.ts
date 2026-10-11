import { inject } from '@angular/core';

import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { retry } from 'rxjs';

import type { DateString } from '@reelscore-sdk/helpers';
import type { CompetitionId, StandingsDTO } from '@reelscore-sdk/models';

import { errorHandler, type StateHandler } from '@app/shared';

import { HttpFixtureStandingsService } from '../data-access';

type FixtureStandingsState = StateHandler<{ standings: StandingsDTO | null }>;

const initialState: FixtureStandingsState = {
  isLoading: false,
  error: null,
  standings: null,
};

export const FixtureStandingsStore = signalStore(
  withState(initialState),
  withMethods((store, http = inject(HttpFixtureStandingsService)) => {
    let latestRequestId = 0;

    return {
      loadFixtureStandings(
        teamIds: string,
        competition: CompetitionId,
        date: DateString,
        silent = false
      ): void {
        const requestId = ++latestRequestId;
        patchState(store, {
          ...(silent ? {} : { standings: null }),
          isLoading: !silent,
          error: null,
        });

        http
          .getFixtureStandings(teamIds, competition, date)
          .pipe(retry(errorHandler))
          .subscribe({
            next: (standings) => {
              if (requestId !== latestRequestId) return;

              patchState(store, { standings, isLoading: false, error: null });
            },
            error: (error) => {
              if (requestId !== latestRequestId) return;

              patchState(store, {
                standings: silent ? store.standings() : null,
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
