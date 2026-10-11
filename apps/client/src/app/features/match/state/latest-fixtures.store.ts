import { inject } from '@angular/core';

import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { retry } from 'rxjs';

import type { FixtureId, LatestFixturesDTO } from '@reelscore-sdk/models';

import { errorHandler, type StateHandler } from '@app/shared';

import { HttpLatestFixturesService } from '../data-access';

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
  withMethods((store, http = inject(HttpLatestFixturesService)) => {
    let latestRequestId = 0;

    return {
      loadLatestFixtures(fixtureId: FixtureId, silent = false): void {
        const requestId = ++latestRequestId;
        patchState(store, {
          ...(silent ? {} : { latestFixtures: null }),
          isLoading: !silent,
          error: null,
        });

        if (!fixtureId) {
          patchState(store, {
            latestFixtures: null,
            isLoading: false,
            error: 'FixtureId in fixture store not defined',
          });
          return;
        }

        http
          .getLatestFixtures(fixtureId)
          .pipe(retry(errorHandler))
          .subscribe({
            next: (latestFixtures) => {
              if (requestId !== latestRequestId) {
                return;
              }

              patchState(store, {
                latestFixtures,
                isLoading: false,
                error: null,
              });
            },
            error: (error) => {
              if (requestId !== latestRequestId) {
                return;
              }

              patchState(store, {
                latestFixtures: silent ? store.latestFixtures() : null,
                isLoading: false,
                error,
              });
            },
          });
      },
      reset(): void {
        latestRequestId++;
        patchState(store, initialState);
      },
    };
  })
);
