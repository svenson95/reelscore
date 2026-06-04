import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { retry } from 'rxjs';

import { errorHandler, type StateHandler } from '@app/shared';
import type { CompetitionId, StandingsDTO } from '@lib/models';
import type { DateString } from '@lib/shared';

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
      patchState(store, { isLoading: true });

      http
        .getFixtureStandings(teamIds, competition, date)
        .pipe(retry(errorHandler))
        .subscribe({
          next: (standings) =>
            patchState(store, {
              standings,
              isLoading: false,
              error: standings ? null : 'Fixture Standings not found',
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
