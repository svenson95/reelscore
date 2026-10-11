import { inject } from '@angular/core';

import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { retry } from 'rxjs';

import type { EvaluationDTO, FixtureId } from '@reelscore-sdk/models';

import { errorHandler, type StateHandler } from '@app/shared';

import { HttpEvaluationsService } from '../data-access';

type EvaluationsState = StateHandler<{ evaluations: EvaluationDTO | null }>;

const initialState: EvaluationsState = {
  isLoading: false,
  error: null,
  evaluations: null,
};

export const EvaluationsStore = signalStore(
  withState(initialState),
  withMethods((store, http = inject(HttpEvaluationsService)) => {
    let latestRequestId = 0;

    return {
      loadEvaluations(fixtureId: FixtureId, silent = false): void {
        const requestId = ++latestRequestId;
        patchState(store, {
          ...(silent ? {} : { evaluations: null }),
          isLoading: !silent,
          error: null,
        });

        http
          .getEvaluations(fixtureId)
          .pipe(retry(errorHandler))
          .subscribe({
            next: (evaluations) => {
              if (requestId !== latestRequestId) return;

              patchState(store, { evaluations, isLoading: false, error: null });
            },
            error: (error) => {
              if (requestId !== latestRequestId) return;

              patchState(store, {
                evaluations: silent ? store.evaluations() : null,
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
