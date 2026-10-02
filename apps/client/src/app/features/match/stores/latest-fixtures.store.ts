import { inject } from '@angular/core';

import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { retry } from 'rxjs';

import type { FixtureId, LatestFixturesDTO } from '@reelscore-sdk/models';

import { errorHandler, type StateHandler } from '@app/shared';

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
      patchState(store, { isLoading: true, error: null });
      if (!fixtureId) {
        return patchState(store, {
          latestFixtures: null,
          isLoading: false,
          error: 'FixtureId in fixture store not defined',
        });
      }

      http
        .getLatestFixtures(fixtureId)
        .pipe(retry(errorHandler))
        .subscribe({
          next: (latestFixtures) =>
            patchState(store, {
              latestFixtures,
              isLoading: false,
              error: null,
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
