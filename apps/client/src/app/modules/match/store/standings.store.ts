import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

import { CompetitionId, StandingsDTO } from '@lib/models';

import { StateHandler } from '../../../shared';
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
      competition: CompetitionId
    ): Promise<void> {
      patchState(store, { isLoading: true });

      http.getFixtureStandings(teamIds, competition).subscribe({
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
