import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

import { StateHandler } from '@app/models';
import { FixtureId, StatisticDTO } from '@lib/models';
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
    async loadStatistics(id: FixtureId): Promise<void> {
      patchState(store, { isLoading: true });

      http.getFixtureStatistics(id).subscribe({
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
  }))
);
