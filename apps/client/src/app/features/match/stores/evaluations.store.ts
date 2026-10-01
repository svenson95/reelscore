import { inject } from '@angular/core';

import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { retry } from 'rxjs';

import type { FixtureId } from '@reelscore-sdk/models';

import type { EvaluationDTO } from '@lib/models';

import { errorHandler } from '@app/shared';

import type { StateHandler } from '@app/shared';

import { HttpEvaluationsService } from '../services';

type EvaluationsState = StateHandler<{ evaluations: EvaluationDTO | null }>;

const initialState: EvaluationsState = {
  isLoading: false,
  error: null,
  evaluations: null,
};

export const EvaluationsStore = signalStore(
  withState(initialState),
  withMethods((store, http = inject(HttpEvaluationsService)) => ({
    async loadEvaluations(fixtureId: FixtureId): Promise<void> {
      patchState(store, { isLoading: true, error: null });

      http
        .getEvaluations(fixtureId)
        .pipe(retry(errorHandler))
        .subscribe({
          next: (evaluations) =>
            patchState(store, {
              evaluations,
              isLoading: false,
              error: null,
            }),
          error: (error) =>
            patchState(store, {
              evaluations: null,
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
