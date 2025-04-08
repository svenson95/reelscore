import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

import { FixtureId, LatestFixturesDTO } from '@lib/models';

import { StateHandler } from '../../../shared';
import { HttpLatestFixturesService } from '../services';

type LatestFixturesState = StateHandler<{
  latestFixtures: LatestFixturesDTO | null;
}>;

const initialState: LatestFixturesState = {
  latestFixtures: null,
  isLoading: false,
  error: null,
};

export const LatestFixturesStore = signalStore(
  withState(initialState),
  withMethods((store, http = inject(HttpLatestFixturesService)) => ({
    async loadLatestFixtures(fixtureId: FixtureId): Promise<void> {
      patchState(store, { isLoading: true });
      if (!fixtureId) {
        return patchState(store, {
          latestFixtures: null,
          isLoading: false,
          error: 'FixtureId in fixture store not defined',
        });
      }

      http.getLatestFixtures(fixtureId).subscribe({
        next: (latestFixtures) =>
          patchState(store, {
            latestFixtures,
            isLoading: false,
            error: latestFixtures ? null : 'Latest Fixtures not found',
          }),
        error: (error) =>
          patchState(store, {
            latestFixtures: null,
            isLoading: false,
            error,
          }),
      });
    },
    async reset(): Promise<void> {
      patchState(store, initialState);
    },
  }))
);
