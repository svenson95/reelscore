import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';

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
