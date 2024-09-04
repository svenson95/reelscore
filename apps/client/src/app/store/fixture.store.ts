import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

import { StateHandler } from '@app/models';
import { HttpFixtureService } from '@app/services';
import { FixtureDTO, FixtureId } from '@lib/models';

type FixtureState = StateHandler<{ fixture: FixtureDTO | null }>;

const initialState: FixtureState = {
  fixture: null,
  isLoading: false,
  error: null,
};

export const FixtureStore = signalStore(
  withState(initialState),
  withMethods((store, http = inject(HttpFixtureService)) => ({
    async loadFixture(id: FixtureId): Promise<void> {
      patchState(store, { isLoading: true });

      http.getFixture(id).subscribe({
        next: (fixture) =>
          patchState(store, {
            fixture,
            isLoading: false,
            error: fixture ? null : 'Fixture not found',
          }),
        error: (error) =>
          patchState(store, {
            fixture: null,
            isLoading: false,
            error,
          }),
      });
    },
  }))
);
