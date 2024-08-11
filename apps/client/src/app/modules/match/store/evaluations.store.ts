import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';

import { StateHandler } from '@app/models';
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
      const evaluations = await firstValueFrom(http.getEvaluations(fixtureId));
      patchState(store, {
        evaluations,
        isLoading: false,
        error: null,
      });
    },
  }))
);
