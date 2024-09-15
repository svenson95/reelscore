import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

import { FixtureDTO } from '@lib/models';
import { DateString } from '../constants';
import { StateHandler } from '../models';
import { HttpFixturesService } from '../services/http/fixtures.service';

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
