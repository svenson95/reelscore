import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { retry } from 'rxjs';

import { errorHandler, StateHandler } from '@app/shared';
import { AnalysesDTO, FixtureId } from '@lib/models';

import { HttpFixtureAnalysesService } from '../services';

type AnalysesState = StateHandler<{ analyses: AnalysesDTO | null }>;

const initialState: AnalysesState = {
  analyses: null,
  isLoading: false,
  error: null,
};

export const AnalysesStore = signalStore(
  withState(initialState),
  withMethods((store, http = inject(HttpFixtureAnalysesService)) => ({
    async loadAnalyses(id: FixtureId): Promise<void> {
      patchState(store, { isLoading: true });

      http
        .getFixtureAnalyses(id)
        .pipe(retry(errorHandler))
        .subscribe({
          next: (analyses) =>
            patchState(store, {
              analyses,
              isLoading: false,
              error: null,
            }),
          error: (error) =>
            patchState(store, {
              analyses: null,
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
