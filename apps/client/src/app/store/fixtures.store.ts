import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

import { DateString } from '@app/constants';
import { StateHandler } from '@app/models';
import { HttpFixturesService } from '@app/services';
import { FixtureDTO } from '@lib/models';

type FixturesState = StateHandler<{ fixtures: FixtureDTO[] | null }>;

const initialState: FixturesState = {
  fixtures: null,
  isLoading: false,
  error: null,
};

export const FixturesStore = signalStore(
  withState(initialState),
  withMethods((store, http = inject(HttpFixturesService)) => ({
    async loadFixtures(date: DateString): Promise<void> {
      patchState(store, { isLoading: true });

      const dateString = date.split('T')[0];
      http.getFixtures(dateString).subscribe({
        next: (fixtures) =>
          patchState(store, {
            fixtures,
            isLoading: false,
            error: fixtures ? null : 'Fixtures not found',
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
