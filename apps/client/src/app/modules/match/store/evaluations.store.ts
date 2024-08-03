import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';

import { EvaluationDTO } from '@lib/models';
import { FixtureStore } from '../../../store';
import { HttpEvaluationsService } from '../services';

type EvaluationsState = {
  evaluations: EvaluationDTO | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: EvaluationsState = {
  evaluations: null,
  isLoading: false,
  error: null,
};

export const EvaluationsStore = signalStore(
  withState(initialState),
  withMethods(
    (
      store,
      http = inject(HttpEvaluationsService),
      fixtureStore = inject(FixtureStore)
    ) => ({
      async loadEvaluations(): Promise<void> {
        patchState(store, { isLoading: true });
        const id = fixtureStore.fixture()?.fixture.id;
        const evaluations = id
          ? await firstValueFrom(http.getEvaluations(id))
          : null;
        patchState(store, {
          evaluations,
          isLoading: false,
          error: evaluations ? null : 'Latest Fixtures not found',
        });
      },
    })
  )
);
