import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';

import { LatestFixturesDTO } from '@lib/models';
import { FixtureStore } from '../../../store';
import { HttpLatestFixturesService } from '../services';

type LatestFixturesState = {
  latestFixtures: LatestFixturesDTO | null;
  isLoading: boolean;
  error: string | null;
};

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
        const latestFixtures = id
          ? await firstValueFrom(http.getLatestFixtures(id))
          : null;
        patchState(store, {
          latestFixtures,
          isLoading: false,
          error: latestFixtures ? null : 'Latest Fixtures not found',
        });
      },
    })
  )
);
