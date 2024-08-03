import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';

import { FixtureId, StatisticDTO } from '@lib/models';
import { HttpFixtureStatisticsService } from '../services';

type StatisticsState = {
  statistics: StatisticDTO[] | null;
  isLoading: boolean;
  error: string | null;
};

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
      const statistics = id
        ? await firstValueFrom(http.getFixtureStatistics(id))
        : null;
      patchState(store, {
        statistics: statistics?.response,
        isLoading: false,
        error: statistics ? null : 'Statistics not found',
      });
    },
  }))
);
