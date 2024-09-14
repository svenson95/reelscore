import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

import { StateHandler } from '@app/models';
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

      http.getFixtureAnalyses(id).subscribe({
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
  }))
);
