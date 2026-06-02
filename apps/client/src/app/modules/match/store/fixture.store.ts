import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

import type { StateHandler } from '@app/shared';
import type { FixtureId, FixtureIdParameter, GetFixtureDTO } from '@lib/models';
import { isCompetitionWithoutStandings } from '@lib/shared';

import { HttpFixtureService } from '../services';

import { AnalysesStore } from './analyses.store';
import { EvaluationsStore } from './evaluations.store';
import { EventsStore } from './events.store';
import { LatestFixturesStore } from './latest-fixtures.store';
import { FixtureStandingsStore } from './standings.store';
import { StatisticsStore } from './statistics.store';

type FixtureState = StateHandler<{
  fixture: GetFixtureDTO | null;
  isRefreshing: boolean;
}>;

const initialState: FixtureState = {
  fixture: null,
  isLoading: false,
  isRefreshing: false,
  error: null,
};

export const FixtureStore = signalStore(
  withState(initialState),
  withMethods(
    (
      store,
      http = inject(HttpFixtureService),
      standingsStore = inject(FixtureStandingsStore),
      evaluationsStore = inject(EvaluationsStore),
      eventsStore = inject(EventsStore),
      statisticsStore = inject(StatisticsStore),
      latestFixturesStore = inject(LatestFixturesStore),
      analysesStore = inject(AnalysesStore)
    ) => {
      const loadFixtureData = (
        id: FixtureId,
        options: {
          isRefresh: boolean;
        }
      ): Promise<void> => {
        const isRefresh = options.isRefresh;

        patchState(
          store,
          isRefresh
            ? {
                isLoading: false,
                isRefreshing: true,
                error: null,
              }
            : {
                ...initialState,
                isLoading: true,
                isRefreshing: false,
              }
        );

        return new Promise((resolve) => {
          http.getFixture(id).subscribe({
            next: (fixture) => {
              const fixtureId = fixture.data.fixture.id;

              patchState(store, {
                fixture,
                isLoading: false,
                isRefreshing: false,
                error: null,
              });

              if (!isCompetitionWithoutStandings(fixture.data.league.id)) {
                const { home, away } = fixture.data.teams;
                const teamIds = `${home.id},${away.id}`;
                const competitionId = fixture.data.league.id;
                const date = fixture.data.fixture.date.split('T')[0];

                standingsStore.loadFixtureStandings(
                  teamIds,
                  competitionId,
                  date
                );
              }

              const fixtureIdParameter: FixtureIdParameter =
                fixtureId.toString();

              evaluationsStore.loadEvaluations(fixtureId);
              latestFixturesStore.loadLatestFixtures(fixtureId);
              analysesStore.loadAnalyses(fixtureId);

              eventsStore.loadEvents({
                fixtureId: fixtureIdParameter,
                teams: fixture.data.teams,
              });

              statisticsStore.loadStatistics(fixtureIdParameter);

              resolve();
            },
            error: (error) => {
              patchState(store, {
                fixture: isRefresh ? store.fixture() : null,
                isLoading: false,
                isRefreshing: false,
                error,
              });

              resolve();
            },
          });
        });
      };

      return {
        loadFixture(id: FixtureId): Promise<void> {
          return loadFixtureData(id, {
            isRefresh: false,
          });
        },

        reloadFixture(): Promise<void> {
          const fixture = store.fixture();

          if (!fixture || store.isLoading() || store.isRefreshing()) {
            return Promise.resolve();
          }

          return loadFixtureData(fixture.data.fixture.id, {
            isRefresh: true,
          });
        },
      };
    }
  )
);
