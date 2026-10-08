import { inject } from '@angular/core';

import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { retry } from 'rxjs';

import type { FixtureIdParameter, StatisticDTO } from '@reelscore-sdk/models';

import { errorHandler, type StateHandler } from '@app/shared';

import { HttpFixtureStatisticsService } from '../services';

type StatisticsState = StateHandler<{ statistics: StatisticDTO[] | null }>;

const initialState: StatisticsState = {
  statistics: null,
  isLoading: false,
  error: null,
};

export const StatisticsStore = signalStore(
  withState(initialState),
  withMethods((store, http = inject(HttpFixtureStatisticsService)) => ({
    loadStatistics(id: FixtureIdParameter): void {
      patchState(store, { isLoading: true });

      http
        .getFixtureStatistics(id)
        .pipe(retry(errorHandler))
        .subscribe({
          next: (statistics) =>
            patchState(store, {
              statistics: statistics?.response,
              isLoading: false,
              error: statistics?.response ? null : 'Statistics not found',
            }),
          error: (error) =>
            patchState(store, {
              statistics: null,
              isLoading: false,
              error,
            }),
        });
    },
    reset(): void {
      patchState(store, initialState);
    },
  }))
);
