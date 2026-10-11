import { inject } from '@angular/core';

import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { retry } from 'rxjs';

import type { FixtureIdParameter, StatisticDTO } from '@reelscore-sdk/models';

import { errorHandler, type StateHandler } from '@app/shared';

import { HttpFixtureStatisticsService } from '../data-access';

type StatisticsState = StateHandler<{ statistics: StatisticDTO[] | null }>;

const initialState: StatisticsState = {
  statistics: null,
  isLoading: false,
  error: null,
};

export const StatisticsStore = signalStore(
  withState(initialState),
  withMethods((store, http = inject(HttpFixtureStatisticsService)) => {
    let latestRequestId = 0;

    return {
      loadStatistics(id: FixtureIdParameter, silent = false): void {
        const requestId = ++latestRequestId;
        patchState(store, {
          ...(silent ? {} : { statistics: null }),
          isLoading: !silent,
          error: null,
        });

        http
          .getFixtureStatistics(id)
          .pipe(retry(errorHandler))
          .subscribe({
            next: (statistics) => {
              if (requestId !== latestRequestId) return;

              const response = statistics?.response;
              const hasStatistics = Boolean(response?.length);

              patchState(store, {
                statistics: hasStatistics ? response : null,
                isLoading: false,
                error: hasStatistics ? null : 'Statistics not found',
              });
            },
            error: (error) => {
              if (requestId !== latestRequestId) return;

              patchState(store, {
                statistics: silent ? store.statistics() : null,
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
