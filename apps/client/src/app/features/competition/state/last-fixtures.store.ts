import { inject } from '@angular/core';

import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { retry } from 'rxjs';

import type { CompetitionId, ExtendedFixtureDTO } from '@reelscore-sdk/models';

import type { StateHandler } from '@app/shared';
import { errorHandler } from '@app/shared';

import { HttpLastFixturesService } from '../data-access';

type LastFixturesState = StateHandler<{
  fixtures: ExtendedFixtureDTO[][] | null;
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
    loadLastFixtures(id: CompetitionId, showAll = false): void {
      patchState(store, { isLoading: true, showAll });

      http
        .getLastFixturesForCompetition(id, showAll)
        .pipe(retry(errorHandler))
        .subscribe({
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
