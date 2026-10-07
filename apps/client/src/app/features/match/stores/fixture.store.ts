import { inject } from '@angular/core';

import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';
import { retry } from 'rxjs/operators';

import { isCompetitionWithoutStandings } from '@reelscore-sdk/helpers';
import type {
  EventDTO,
  FixtureDTO,
  FixtureId,
  FixtureIdParameter,
  GetFixtureDTO,
} from '@reelscore-sdk/models';

import { filterFixtureHighlights } from '@lib/shared';

import { errorHandler, type StateHandler } from '@app/shared';

import { HttpFixtureService } from '../services';

import { AnalysesStore } from './analyses.store';
import { EvaluationsStore } from './evaluations.store';
import { EventsStore } from './events.store';
import { LatestFixturesStore } from './latest-fixtures.store';
import { FixtureStandingsStore } from './standings.store';
import { StatisticsStore } from './statistics.store';
import { TeamCoachesStore } from './team-coaches.store';

type FixtureState = StateHandler<{
  fixture: GetFixtureDTO | null;
  isRefreshing: boolean;
}>;

type LoadFixtureOptions = {
  isRefresh: boolean;
};

const initialState: FixtureState = {
  fixture: null,
  isLoading: false,
  isRefreshing: false,
  error: null,
};

const getFixtureDate = (fixture: GetFixtureDTO): string => {
  return fixture.data.fixture.date.split('T')[0];
};

const getFixtureIdParameter = (fixtureId: FixtureId): FixtureIdParameter => {
  return fixtureId.toString();
};

const getFixtureTeamIds = (fixture: GetFixtureDTO): string => {
  const { home, away } = fixture.data.teams;

  return `${home.id},${away.id}`;
};

const createFixtureStoreDependencies = () => ({
  http: inject(HttpFixtureService),
  standingsStore: inject(FixtureStandingsStore),
  evaluationsStore: inject(EvaluationsStore),
  eventsStore: inject(EventsStore),
  statisticsStore: inject(StatisticsStore),
  teamCoachesStore: inject(TeamCoachesStore),
  latestFixturesStore: inject(LatestFixturesStore),
  analysesStore: inject(AnalysesStore),
});

export const FixtureStore = signalStore(
  withState(initialState),
  withMethods((store, dependencies = createFixtureStoreDependencies()) => {
    const {
      http,
      standingsStore,
      evaluationsStore,
      eventsStore,
      statisticsStore,
      teamCoachesStore,
      latestFixturesStore,
      analysesStore,
    } = dependencies;

    const patchLoadingState = (isRefresh: boolean): void => {
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
    };

    const patchFixtureLoaded = (fixture: GetFixtureDTO): void => {
      patchState(store, {
        fixture,
        isLoading: false,
        isRefreshing: false,
        error: null,
      });
    };

    const patchFixtureError = (isRefresh: boolean): void => {
      patchState(store, {
        fixture: isRefresh ? store.fixture() : null,
        isLoading: false,
        isRefreshing: false,
        error: null,
      });
    };

    const loadFixtureStandings = (fixture: GetFixtureDTO): void => {
      const competitionId = fixture.data.league.id;

      if (isCompetitionWithoutStandings(competitionId)) {
        return;
      }

      const teamIds = getFixtureTeamIds(fixture);
      const date = getFixtureDate(fixture);

      standingsStore.loadFixtureStandings(teamIds, competitionId, date);
    };

    const loadRelatedFixtureData = (fixture: GetFixtureDTO): void => {
      const fixtureId = fixture.data.fixture.id;
      const fixtureIdParameter = getFixtureIdParameter(fixtureId);

      loadFixtureStandings(fixture);

      evaluationsStore.loadEvaluations(fixtureId);
      void latestFixturesStore.loadLatestFixtures(fixtureId);
      void analysesStore.loadAnalyses(fixtureId);

      void eventsStore.loadEvents({
        fixtureId: fixtureIdParameter,
        teams: fixture.data.teams,
      });

      void statisticsStore.loadStatistics(fixtureIdParameter);

      teamCoachesStore.loadTeamCoaches(getFixtureTeamIds(fixture));
    };

    const loadFixtureData = async (
      id: FixtureId,
      options: LoadFixtureOptions
    ): Promise<void> => {
      const { isRefresh } = options;

      patchLoadingState(isRefresh);

      try {
        const fixture = await firstValueFrom(
          http.getFixture(id).pipe(retry(errorHandler))
        );

        patchFixtureLoaded(fixture);
        loadRelatedFixtureData(fixture);
      } catch {
        patchFixtureError(isRefresh);
      }
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

      updateHighlights(events: EventDTO[]): void {
        const fixture = store.fixture();

        if (!fixture) return;

        patchState(store, {
          fixture: {
            ...fixture,
            highlights: filterFixtureHighlights(events),
          },
        });
      },

      updateFixture(fixture: FixtureDTO): void {
        const currentFixture = store.fixture();

        if (currentFixture?.data.fixture.id !== fixture.fixture.id) {
          return;
        }

        patchState(store, {
          fixture: {
            ...currentFixture,
            data: {
              ...currentFixture.data,
              ...fixture,
            },
          },
        });
      },
    };
  })
);
