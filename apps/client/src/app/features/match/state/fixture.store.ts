import { inject } from '@angular/core';

import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';
import { retry } from 'rxjs/operators';

import { isCompetitionWithoutStandings } from '@reelscore-sdk/helpers';
import type {
  EventDTO,
  ExtendedFixtureDTO,
  FixtureDTO,
  FixtureId,
  FixtureIdParameter,
  GetFixtureDTO,
} from '@reelscore-sdk/models';

import { filterFixtureHighlights } from '@lib/shared';

import { errorHandler, type StateHandler } from '@app/shared';

import { HttpFixtureService } from '../data-access';

import { AnalysesStore } from './analyses.store';
import { EvaluationsStore } from './evaluations.store';
import { EventsStore } from './events.store';
import { HeadToHeadFixturesStore } from './head-to-head-fixtures.store';
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
  headToHeadFixturesStore: inject(HeadToHeadFixturesStore),
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
      headToHeadFixturesStore,
      analysesStore,
    } = dependencies;

    let currentLoadId = 0;

    const resetRelatedFixtureData = (): void => {
      standingsStore.reset();
      evaluationsStore.reset();
      eventsStore.reset();
      statisticsStore.reset();
      teamCoachesStore.reset();
      latestFixturesStore.reset();
      headToHeadFixturesStore.reset();
      analysesStore.reset();
    };

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

      if (!isRefresh) {
        resetRelatedFixtureData();
      }
    };

    const patchFixtureLoaded = (
      fixture: GetFixtureDTO,
      isRefresh = false
    ): void => {
      let loadedFixture = fixture;

      if (isRefresh) {
        const currentEvents = eventsStore.events();
        const currentFixture = store.fixture();

        if (currentEvents) {
          loadedFixture = {
            ...fixture,
            highlights: filterFixtureHighlights(currentEvents),
          };
        } else if (currentFixture) {
          loadedFixture = {
            ...fixture,
            highlights: currentFixture.highlights,
          };
        }
      }

      patchState(store, {
        fixture: loadedFixture,
        isLoading: false,
        isRefreshing: false,
        error: null,
      });
    };

    const patchFixtureError = (isRefresh: boolean, error: unknown): void => {
      patchState(store, {
        fixture: isRefresh ? store.fixture() : null,
        isLoading: false,
        isRefreshing: false,
        error: error instanceof Error ? error.message : String(error),
      });
    };

    const loadFixtureStandings = (
      fixture: GetFixtureDTO,
      options: LoadFixtureOptions
    ): void => {
      const competitionId = fixture.data.league.id;

      if (isCompetitionWithoutStandings(competitionId)) {
        return;
      }

      const teamIds = getFixtureTeamIds(fixture);
      const date = getFixtureDate(fixture);

      standingsStore.loadFixtureStandings(
        teamIds,
        competitionId,
        date,
        options.isRefresh
      );
    };

    const updateHighlights = (events: EventDTO[]): void => {
      const fixture = store.fixture();

      if (!fixture) return;

      patchState(store, {
        fixture: {
          ...fixture,
          highlights: filterFixtureHighlights(events),
        },
      });
    };

    const loadRelatedFixtureData = (
      fixture: GetFixtureDTO,
      options: LoadFixtureOptions
    ): void => {
      const fixtureId = fixture.data.fixture.id;
      const fixtureIdParameter = getFixtureIdParameter(fixtureId);

      loadFixtureStandings(fixture, options);

      evaluationsStore.loadEvaluations(fixtureId, options.isRefresh);
      latestFixturesStore.loadLatestFixtures(fixtureId, options.isRefresh);
      headToHeadFixturesStore.loadHeadToHeadFixtures(
        fixtureId,
        options.isRefresh
      );
      analysesStore.loadAnalyses(fixtureId, options.isRefresh);

      eventsStore.loadEvents(
        {
          fixtureId: fixtureIdParameter,
          teams: fixture.data.teams,
          onEventsLoaded: updateHighlights,
        },
        options.isRefresh
      );

      statisticsStore.loadStatistics(fixtureIdParameter, options.isRefresh);

      teamCoachesStore.loadTeamCoaches(
        getFixtureTeamIds(fixture),
        options.isRefresh
      );
    };

    const loadFixtureData = async (
      id: FixtureId,
      options: LoadFixtureOptions
    ): Promise<void> => {
      const { isRefresh } = options;
      const loadId = ++currentLoadId;

      patchLoadingState(isRefresh);

      try {
        const fixture = await firstValueFrom(
          http.getFixture(id).pipe(retry(errorHandler))
        );

        if (loadId !== currentLoadId) {
          return;
        }

        patchFixtureLoaded(fixture, isRefresh);
        loadRelatedFixtureData(fixture, options);
      } catch (error) {
        if (loadId !== currentLoadId) {
          return;
        }

        patchFixtureError(isRefresh, error);
      }
    };

    return {
      loadFixture(id: FixtureId): Promise<void> {
        return loadFixtureData(id, {
          isRefresh: false,
        });
      },

      loadFixtureFromList(fixture: ExtendedFixtureDTO): void {
        currentLoadId += 1;
        resetRelatedFixtureData();

        const loadedFixture: GetFixtureDTO = {
          data: fixture,
          highlights: [],
        };
        patchFixtureLoaded(loadedFixture);
        loadRelatedFixtureData(loadedFixture, { isRefresh: false });
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

      updateHighlights,

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
