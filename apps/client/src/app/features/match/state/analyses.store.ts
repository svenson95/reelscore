import { inject } from '@angular/core';

import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { retry } from 'rxjs';

import type { AnalysesDTO, FixtureId } from '@reelscore-sdk/models';

import { errorHandler, type StateHandler } from '@app/shared';

import { HttpFixtureAnalysesService } from '../data-access';

type AnalysesState = StateHandler<{ analyses: AnalysesDTO | null }>;

const initialState: AnalysesState = {
  analyses: null,
  isLoading: false,
  error: null,
};

export const AnalysesStore = signalStore(
  withState(initialState),
  withMethods((store, http = inject(HttpFixtureAnalysesService)) => {
    let latestRequestId = 0;

    return {
      loadAnalyses(id: FixtureId, silent = false): void {
        const requestId = ++latestRequestId;
        patchState(store, {
          ...(silent ? {} : { analyses: null }),
          isLoading: !silent,
          error: null,
        });

        http
          .getFixtureAnalyses(id)
          .pipe(retry(errorHandler))
          .subscribe({
            next: (analyses) => {
              if (requestId !== latestRequestId) return;

              patchState(store, { analyses, isLoading: false, error: null });
            },
            error: (error) => {
              if (requestId !== latestRequestId) return;

              patchState(store, {
                analyses: silent ? store.analyses() : null,
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
