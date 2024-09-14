import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

import { StateHandler } from '@app/models';
import { FixtureId, MetricsDTO } from '@lib/models';
import { HttpFixtureMetricsService } from '../services';

type MetricsState = StateHandler<{ metrics: MetricsDTO | null }>;

const initialState: MetricsState = {
  metrics: null,
  isLoading: false,
  error: null,
};

export const MetricsStore = signalStore(
  withState(initialState),
  withMethods((store, http = inject(HttpFixtureMetricsService)) => ({
    async loadMetrics(id: FixtureId): Promise<void> {
      patchState(store, { isLoading: true });

      http.getFixtureMetrics(id).subscribe({
        next: (metrics) =>
          patchState(store, {
            metrics,
            isLoading: false,
            error: null,
          }),
        error: (error) =>
          patchState(store, {
            metrics: null,
            isLoading: false,
            error,
          }),
      });
    },
  }))
);
