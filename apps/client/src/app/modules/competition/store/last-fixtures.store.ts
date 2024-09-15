import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

import { StateHandler } from '@app/models';
import { CompetitionId, FixtureDTO } from '@lib/models';
import { HttpLastFixturesService } from '../services';

type LastFixturesState = StateHandler<{
  fixtures: FixtureDTO[][] | null;
  showAll: boolean;
}>;

const initialState: LastFixturesState = {
  fixtures: null,
  showAll: false,
  isLoading: false,
  error: null,
};

export const LastFixturesStore = signalStore(
  withState(initialState),
  withMethods((store, http = inject(HttpLastFixturesService)) => ({
    async loadLastFixtures(id: CompetitionId, showAll = false): Promise<void> {
      patchState(store, { isLoading: true, showAll });

      http.getLastFixturesForCompetition(id, showAll).subscribe({
        next: (fixtures) =>
          patchState(store, {
            fixtures,
            isLoading: false,
            error: fixtures ? null : 'Last Fixtures not found',
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
