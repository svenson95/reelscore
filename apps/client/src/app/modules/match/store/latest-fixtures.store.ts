import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

import { StateHandler } from '@app/models';
import { LatestFixturesDTO } from '@lib/models';
import { FixtureStore } from '../../../store';
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
  withMethods(
    (
      store,
      http = inject(HttpLatestFixturesService),
      fixtureStore = inject(FixtureStore)
    ) => ({
      async loadLatestFixtures(): Promise<void> {
        patchState(store, { isLoading: true });
        const id = fixtureStore.fixture()?.fixture.id;
        if (!id) {
          return patchState(store, {
            latestFixtures: null,
            isLoading: false,
            error: 'Fixture Id in fixture store not defined',
          });
        }

        http.getLatestFixtures(id).subscribe({
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
    })
  )
);
