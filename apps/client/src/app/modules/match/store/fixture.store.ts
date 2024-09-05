import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

import { StateHandler } from '@app/models';
import { HttpFixtureService } from '@app/services';
import { FixtureDTO, FixtureId } from '@lib/models';
import { EvaluationsStore } from './evaluations.store';
import { EventsStore } from './events.store';
import { LatestFixturesStore } from './latest-fixtures.store';
import { StatisticsStore } from './statistics.store';

type FixtureState = StateHandler<{ fixture: FixtureDTO | null }>;

const initialState: FixtureState = {
  fixture: null,
  isLoading: false,
  error: null,
};

export const FixtureStore = signalStore(
  withState(initialState),
  withMethods(
    (
      store,
      http = inject(HttpFixtureService),
      evaluationsStore = inject(EvaluationsStore),
      eventsStore = inject(EventsStore),
      statisticsStore = inject(StatisticsStore),
      latestFixturesStore = inject(LatestFixturesStore)
    ) => ({
      async loadFixture(id: FixtureId): Promise<void> {
        patchState(store, { isLoading: true });

        http.getFixture(id).subscribe({
          next: async (fixture) => {
            const fixtureId = fixture.fixture.id;
            evaluationsStore.loadEvaluations(fixtureId);
            latestFixturesStore.loadLatestFixtures(fixtureId);
            eventsStore.loadEvents(fixtureId, fixture.teams);
            statisticsStore.loadStatistics(fixtureId);

            return patchState(store, {
              fixture,
              isLoading: false,
              error: fixture ? null : 'Fixture not found',
            });
          },
          error: (error) =>
            patchState(store, {
              fixture: null,
              isLoading: false,
              error,
            }),
        });
      },
    })
  )
);
