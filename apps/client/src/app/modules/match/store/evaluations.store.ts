import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

import { StateHandler } from '@app/shared';
import { EvaluationDTO, FixtureId } from '@lib/models';

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
      patchState(store, { isLoading: true });

      http.getEvaluations(fixtureId).subscribe({
        next: (evaluations) =>
          patchState(store, {
            evaluations,
            isLoading: false,
            error: evaluations ? null : 'Evaluations not found',
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
