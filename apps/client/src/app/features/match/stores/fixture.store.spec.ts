import { TestBed } from '@angular/core/testing';

import { of, Subject } from 'rxjs';

import type {
  EventDTO,
  FixtureDTO,
  GetFixtureDTO,
} from '@reelscore-sdk/models';

import { COMPETITION_ID } from '@lib/shared';

import { EXAMPLE_FIXTURE } from '../../../../testing/fixtures.mock';
import { HttpFixtureService } from '../services';

import { AnalysesStore } from './analyses.store';
import { EvaluationsStore } from './evaluations.store';
import { EventsStore } from './events.store';
import { FixtureStore } from './fixture.store';
import { LatestFixturesStore } from './latest-fixtures.store';
import { FixtureStandingsStore } from './standings.store';
import { StatisticsStore } from './statistics.store';

describe('FixtureStore', () => {
  let store: InstanceType<typeof FixtureStore>;

  const httpMock = { getFixture: jest.fn() };
  const standingsStoreMock = { loadFixtureStandings: jest.fn() };
  const evaluationsStoreMock = { loadEvaluations: jest.fn() };
  const eventsStoreMock = { loadEvents: jest.fn() };
  const statisticsStoreMock = { loadStatistics: jest.fn() };
  const latestFixturesStoreMock = { loadLatestFixtures: jest.fn() };
  const analysesStoreMock = { loadAnalyses: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        FixtureStore,
        { provide: HttpFixtureService, useValue: httpMock },
        { provide: FixtureStandingsStore, useValue: standingsStoreMock },
        { provide: EvaluationsStore, useValue: evaluationsStoreMock },
        { provide: EventsStore, useValue: eventsStoreMock },
        { provide: StatisticsStore, useValue: statisticsStoreMock },
        { provide: LatestFixturesStore, useValue: latestFixturesStoreMock },
        { provide: AnalysesStore, useValue: analysesStoreMock },
      ],
    });
    store = TestBed.inject(FixtureStore);
  });

  it('should load the fixture and start its related data requests', async () => {
    const response$ = new Subject<GetFixtureDTO>();
    const fixture = createFixture();
    httpMock.getFixture.mockReturnValue(response$);
    const load = store.loadFixture(42);

    expect(store.isLoading()).toBe(true);

    response$.next(fixture);
    response$.complete();
    await load;

    expect(store.fixture()).toBe(fixture);
    expect(store.isLoading()).toBe(false);
    expect(standingsStoreMock.loadFixtureStandings).toHaveBeenCalledWith(
      `${EXAMPLE_FIXTURE.teams.home.id},${EXAMPLE_FIXTURE.teams.away.id}`,
      EXAMPLE_FIXTURE.league.id,
      '2026-05-30'
    );
    expect(evaluationsStoreMock.loadEvaluations).toHaveBeenCalledWith(
      EXAMPLE_FIXTURE.fixture.id
    );
    expect(eventsStoreMock.loadEvents).toHaveBeenCalledWith({
      fixtureId: String(EXAMPLE_FIXTURE.fixture.id),
      teams: EXAMPLE_FIXTURE.teams,
    });
    expect(statisticsStoreMock.loadStatistics).toHaveBeenCalledWith(
      String(EXAMPLE_FIXTURE.fixture.id)
    );
  });

  it('should skip standings for competitions without standings', async () => {
    const fixture = createFixture({
      league: {
        ...EXAMPLE_FIXTURE.league,
        id: COMPETITION_ID.INTERNATIONAL_FRIENDLIES,
      },
    });
    httpMock.getFixture.mockReturnValue(of(fixture));
    await store.loadFixture(42);

    expect(standingsStoreMock.loadFixtureStandings).not.toHaveBeenCalled();
    expect(evaluationsStoreMock.loadEvaluations).toHaveBeenCalled();
    expect(eventsStoreMock.loadEvents).toHaveBeenCalled();
  });

  it('should preserve the fixture and prevent overlapping refreshes', async () => {
    const fixture = createFixture();
    const refresh$ = new Subject<GetFixtureDTO>();
    httpMock.getFixture
      .mockReturnValueOnce(of(fixture))
      .mockReturnValueOnce(refresh$);
    await store.loadFixture(42);

    const refresh = store.reloadFixture();
    await store.reloadFixture();

    expect(httpMock.getFixture).toHaveBeenCalledTimes(2);
    expect(store.fixture()).toBe(fixture);
    expect(store.isLoading()).toBe(false);
    expect(store.isRefreshing()).toBe(true);

    const refreshedFixture = createFixture({
      goals: { home: 2, away: 1 },
    });
    refresh$.next(refreshedFixture);
    refresh$.complete();
    await refresh;

    expect(store.fixture()).toBe(refreshedFixture);
    expect(store.isRefreshing()).toBe(false);
  });

  it('should merge matching realtime fixture data and update highlights', async () => {
    const fixture = createFixture();
    httpMock.getFixture.mockReturnValue(of(fixture));
    await store.loadFixture(42);

    const update: FixtureDTO = {
      ...EXAMPLE_FIXTURE,
      goals: { home: 2, away: 1 },
    };
    const goal = createEvent('Goal', 'Normal Goal', 20);
    const yellowCard = createEvent('Card', 'Yellow Card', 10);

    store.updateFixture(update);
    store.updateHighlights([goal, yellowCard]);

    expect(store.fixture()?.data.goals).toEqual({ home: 2, away: 1 });
    expect(store.fixture()?.data.final).toBe(EXAMPLE_FIXTURE.final);
    expect(store.fixture()?.highlights).toEqual([goal]);

    const stateAfterMatchingUpdate = store.fixture();
    store.updateFixture({
      ...update,
      fixture: { ...update.fixture, id: 999 },
    });

    expect(store.fixture()).toBe(stateAfterMatchingUpdate);
  });
});

function createFixture(overrides: Partial<FixtureDTO> = {}): GetFixtureDTO {
  return {
    data: {
      ...EXAMPLE_FIXTURE,
      ...overrides,
    },
    highlights: [],
  };
}

function createEvent(
  type: EventDTO['type'],
  detail: EventDTO['detail'],
  elapsed: number
): EventDTO {
  return {
    time: { elapsed, extra: null },
    team: { ...EXAMPLE_FIXTURE.teams.home, goals: 0 },
    player: { id: 1, name: 'Player' },
    assist: { id: null, name: '' },
    type,
    detail,
    comments: '',
  };
}
