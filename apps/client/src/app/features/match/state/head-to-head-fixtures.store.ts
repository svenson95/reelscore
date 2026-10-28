import { inject } from '@angular/core';

import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { retry } from 'rxjs';

import type { ExtendedFixtureDTO, FixtureId } from '@reelscore-sdk/models';

import { errorHandler, type StateHandler } from '@app/shared';

import { HttpHeadToHeadFixturesService } from '../data-access';

type HeadToHeadFixturesState = StateHandler<{
  headToHeadFixtures: ExtendedFixtureDTO[] | null;
}>;

const initialState: HeadToHeadFixturesState = {
  headToHeadFixtures: null,
  isLoading: false,
  error: null,
};

export const HeadToHeadFixturesStore = signalStore(
  withState(initialState),
  withMethods((store, http = inject(HttpHeadToHeadFixturesService)) => {
    let latestRequestId = 0;

    return {
      loadHeadToHeadFixtures(fixtureId: FixtureId, silent = false): void {
        const requestId = ++latestRequestId;
        patchState(store, {
          ...(silent ? {} : { headToHeadFixtures: null }),
          isLoading: !silent,
          error: null,
        });

        http
          .getHeadToHeadFixtures(fixtureId)
          .pipe(retry(errorHandler))
          .subscribe({
            next: (headToHeadFixtures) => {
              if (requestId !== latestRequestId) return;

              patchState(store, {
                headToHeadFixtures,
                isLoading: false,
                error: null,
              });
            },
            error: (error) => {
              if (requestId !== latestRequestId) return;

              patchState(store, {
                headToHeadFixtures: silent ? store.headToHeadFixtures() : null,
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
