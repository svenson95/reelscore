import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

import { StateHandler } from '@app/shared';
import { FixtureId, GetFixtureDTO } from '@lib/models';
import {
  isCompetitionWithMultipleGroups,
  isCompetitionWithoutStandings,
} from '@lib/shared';
import { HttpFixtureService } from '../services';

import { AnalysesStore } from './analyses.store';
import { EvaluationsStore } from './evaluations.store';
import { EventsStore } from './events.store';
import { LatestFixturesStore } from './latest-fixtures.store';
import { FixtureStandingsStore } from './standings.store';
import { StatisticsStore } from './statistics.store';

type FixtureState = StateHandler<{ fixture: GetFixtureDTO | null }>;

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
      standingsStore = inject(FixtureStandingsStore),
      evaluationsStore = inject(EvaluationsStore),
      eventsStore = inject(EventsStore),
      statisticsStore = inject(StatisticsStore),
      latestFixturesStore = inject(LatestFixturesStore),
      analysesStore = inject(AnalysesStore)
    ) => ({
      async loadFixture(id: FixtureId): Promise<void> {
        patchState(store, { isLoading: true });

        http.getFixture(id).subscribe({
          next: async (fixture) => {
            const fixtureId = fixture.data.fixture.id;

            if (!isCompetitionWithoutStandings(fixture.data.league.id)) {
              const { home, away } = fixture.data.teams;
              const teamIds = home.id + ',' + away.id;
              const competitionId = fixture.data.league.id;
              standingsStore.loadFixtureStandings(teamIds, competitionId);

              if (!isCompetitionWithMultipleGroups(fixture.data.league.id)) {
                analysesStore.loadAnalyses(fixtureId);
              }
            }

            evaluationsStore.loadEvaluations(fixtureId);
            latestFixturesStore.loadLatestFixtures(fixtureId);
            eventsStore.loadEvents(fixtureId, fixture.data.teams);
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
