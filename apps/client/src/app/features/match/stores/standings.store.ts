import { inject } from '@angular/core';

import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { retry } from 'rxjs';

import type { DateString } from '@reelscore-sdk/helpers';
import type { CompetitionId, StandingsDTO } from '@reelscore-sdk/models';

import { errorHandler, type StateHandler } from '@app/shared';

import { HttpFixtureStandingsService } from '../services';

type FixtureStandingsState = StateHandler<{ standings: StandingsDTO | null }>;

const initialState: FixtureStandingsState = {
  isLoading: false,
  error: null,
  standings: null,
};

export const FixtureStandingsStore = signalStore(
  withState(initialState),
  withMethods((store, http = inject(HttpFixtureStandingsService)) => ({
    async loadFixtureStandings(
      teamIds: string,
      competition: CompetitionId,
      date: DateString
    ): Promise<void> {
      patchState(store, { isLoading: true, error: null });

      http
        .getFixtureStandings(teamIds, competition, date)
        .pipe(retry(errorHandler))
        .subscribe({
          next: (standings) =>
            patchState(store, {
              standings,
              isLoading: false,
              error: null,
            }),
          error: (error) =>
            patchState(store, {
              standings: null,
              isLoading: false,
              error,
            }),
        });
    },
  }))
);
