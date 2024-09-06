import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

import { StateHandler } from '@app/models';
import { CompetitionId, FixtureDTO } from '@lib/models';
import { HttpNextFixturesService } from '../services';

type NextFixturesState = StateHandler<{ fixtures: FixtureDTO[] | null }>;

const initialState: NextFixturesState = {
  fixtures: null,
  isLoading: false,
  error: null,
};

export const NextFixturesStore = signalStore(
  withState(initialState),
  withMethods((store, http = inject(HttpNextFixturesService)) => ({
    async loadNextFixtures(id: CompetitionId): Promise<void> {
      patchState(store, { isLoading: true });

      http.getNextFixturesForCompetition(id).subscribe({
        next: (fixtures) =>
          patchState(store, {
            fixtures,
            isLoading: false,
            error: fixtures ? null : 'Next Fixtures not found',
          }),
        error: (error) =>
          patchState(store, {
            fixtures: null,
            isLoading: false,
            error,
          }),
      });
    },
  }))
);
