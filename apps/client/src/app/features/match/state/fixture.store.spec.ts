import { TestBed } from '@angular/core/testing';

import { of, Subject, throwError } from 'rxjs';

import { COMPETITION_ID } from '@reelscore-sdk/constants';
import type {
  EventDTO,
  FixtureDTO,
  GetFixtureDTO,
} from '@reelscore-sdk/models';

import { EXAMPLE_FIXTURE } from '@testing/client';

import { HttpFixtureService } from '../data-access';

import { AnalysesStore } from './analyses.store';
import { EvaluationsStore } from './evaluations.store';
import { EventsStore } from './events.store';
import { FixtureStore } from './fixture.store';
import { HeadToHeadFixturesStore } from './head-to-head-fixtures.store';
import { LatestFixturesStore } from './latest-fixtures.store';
import { FixtureStandingsStore } from './standings.store';
import { StatisticsStore } from './statistics.store';
import { TeamCoachesStore } from './team-coaches.store';

describe('FixtureStore', () => {
  let store: InstanceType<typeof FixtureStore>;

  const httpMock = { getFixture: jest.fn() };
  const standingsStoreMock = {
    loadFixtureStandings: jest.fn(),
    reset: jest.fn(),
  };
  const evaluationsStoreMock = { loadEvaluations: jest.fn(), reset: jest.fn() };
  const eventsStoreMock = { loadEvents: jest.fn(), reset: jest.fn() };
  const statisticsStoreMock = { loadStatistics: jest.fn(), reset: jest.fn() };
  const latestFixturesStoreMock = {
    loadLatestFixtures: jest.fn(),
    reset: jest.fn(),
  };
  const headToHeadFixturesStoreMock = {
    loadHeadToHeadFixtures: jest.fn(),
    reset: jest.fn(),
  };
  const analysesStoreMock = { loadAnalyses: jest.fn(), reset: jest.fn() };
  const teamCoachesStoreMock = { loadTeamCoaches: jest.fn(), reset: jest.fn() };

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
        {
          provide: HeadToHeadFixturesStore,
          useValue: headToHeadFixturesStoreMock,
        },
        { provide: AnalysesStore, useValue: analysesStoreMock },
        { provide: TeamCoachesStore, useValue: teamCoachesStoreMock },
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
    expect(
      [
        standingsStoreMock.reset,
        evaluationsStoreMock.reset,
        eventsStoreMock.reset,
        statisticsStoreMock.reset,
        teamCoachesStoreMock.reset,
        latestFixturesStoreMock.reset,
        headToHeadFixturesStoreMock.reset,
        analysesStoreMock.reset,
      ].every((reset) => reset.mock.calls.length === 1)
    ).toBe(true);
    expect(standingsStoreMock.loadFixtureStandings).toHaveBeenCalledWith(
      `${EXAMPLE_FIXTURE.teams.home.id},${EXAMPLE_FIXTURE.teams.away.id}`,
      EXAMPLE_FIXTURE.league.id,
      '2026-05-30',
      false
    );
    expect(evaluationsStoreMock.loadEvaluations).toHaveBeenCalledWith(
      EXAMPLE_FIXTURE.fixture.id,
      false
    );
    expect(eventsStoreMock.loadEvents).toHaveBeenCalledWith(
      expect.objectContaining({
        fixtureId: String(EXAMPLE_FIXTURE.fixture.id),
        teams: EXAMPLE_FIXTURE.teams,
      }),
      false
    );
    expect(statisticsStoreMock.loadStatistics).toHaveBeenCalledWith(
      String(EXAMPLE_FIXTURE.fixture.id),
      false
    );
  });

  it('should use fixture data from a list without requesting fixture details', () => {
    store.loadFixtureFromList(EXAMPLE_FIXTURE);

    expect(store.fixture()?.data).toBe(EXAMPLE_FIXTURE);
    expect(httpMock.getFixture).not.toHaveBeenCalled();
    expect(evaluationsStoreMock.loadEvaluations).toHaveBeenCalledWith(
      EXAMPLE_FIXTURE.fixture.id,
      false
    );
    expect(latestFixturesStoreMock.loadLatestFixtures).toHaveBeenCalledWith(
      EXAMPLE_FIXTURE.fixture.id,
      false
    );
    expect(
      headToHeadFixturesStoreMock.loadHeadToHeadFixtures
    ).toHaveBeenCalledWith(EXAMPLE_FIXTURE.fixture.id, false);
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
    expect(latestFixturesStoreMock.reset).toHaveBeenCalledTimes(1);

    const refreshedFixture = createFixture({
      goals: { home: 2, away: 1 },
    });
    refresh$.next(refreshedFixture);
    refresh$.complete();
    await refresh;

    expect(store.fixture()).toBe(refreshedFixture);
    expect(store.isRefreshing()).toBe(false);
    expect(standingsStoreMock.loadFixtureStandings).toHaveBeenLastCalledWith(
      expect.any(String),
      EXAMPLE_FIXTURE.league.id,
      '2026-05-30',
      true
    );
    expect(evaluationsStoreMock.loadEvaluations).toHaveBeenLastCalledWith(
      EXAMPLE_FIXTURE.fixture.id,
      true
    );
    expect(eventsStoreMock.loadEvents).toHaveBeenLastCalledWith(
      expect.objectContaining({
        fixtureId: String(EXAMPLE_FIXTURE.fixture.id),
      }),
      true
    );
    expect(statisticsStoreMock.loadStatistics).toHaveBeenLastCalledWith(
      String(EXAMPLE_FIXTURE.fixture.id),
      true
    );
    expect(teamCoachesStoreMock.loadTeamCoaches).toHaveBeenLastCalledWith(
      `${EXAMPLE_FIXTURE.teams.home.id},${EXAMPLE_FIXTURE.teams.away.id}`,
      true
    );
    expect(latestFixturesStoreMock.loadLatestFixtures).toHaveBeenLastCalledWith(
      EXAMPLE_FIXTURE.fixture.id,
      true
    );
    expect(
      headToHeadFixturesStoreMock.loadHeadToHeadFixtures
    ).toHaveBeenLastCalledWith(EXAMPLE_FIXTURE.fixture.id, true);
    expect(analysesStoreMock.loadAnalyses).toHaveBeenLastCalledWith(
      EXAMPLE_FIXTURE.fixture.id,
      true
    );
  });

  it('should clear the previous fixture while loading another match', async () => {
    const previousFixture = createFixture();
    const nextFixture = createFixture({ goals: { home: 1, away: 0 } });
    const nextFixtureResponse$ = new Subject<GetFixtureDTO>();

    httpMock.getFixture
      .mockReturnValueOnce(of(previousFixture))
      .mockReturnValueOnce(nextFixtureResponse$);
    await store.loadFixture(42);

    const nextLoad = store.loadFixture(84);

    expect(store.fixture()).toBeNull();
    expect(store.isLoading()).toBe(true);

    nextFixtureResponse$.next(nextFixture);
    nextFixtureResponse$.complete();
    await nextLoad;

    expect(store.fixture()).toBe(nextFixture);
    expect(store.isLoading()).toBe(false);
  });

  it('should ignore an older match response after navigating to another match', async () => {
    const previousFixtureResponse$ = new Subject<GetFixtureDTO>();
    const nextFixture = createFixture({ goals: { home: 1, away: 0 } });

    httpMock.getFixture
      .mockReturnValueOnce(previousFixtureResponse$)
      .mockReturnValueOnce(of(nextFixture));

    const previousLoad = store.loadFixture(42);
    await store.loadFixture(84);

    previousFixtureResponse$.next(createFixture());
    previousFixtureResponse$.complete();
    await previousLoad;

    expect(store.fixture()).toBe(nextFixture);
  });

  it('should ignore an older match error after navigating to another match', async () => {
    const previousFixtureResponse$ = new Subject<GetFixtureDTO>();
    const nextFixture = createFixture({ goals: { home: 1, away: 0 } });

    httpMock.getFixture
      .mockReturnValueOnce(previousFixtureResponse$)
      .mockReturnValueOnce(of(nextFixture));

    const previousLoad = store.loadFixture(42);
    await store.loadFixture(84);

    previousFixtureResponse$.error(new Error('Old request failed'));
    await previousLoad;

    expect(store.fixture()).toBe(nextFixture);
    expect(store.isLoading()).toBe(false);
  });

  it('should finish loading when the current match request fails', async () => {
    httpMock.getFixture.mockReturnValue(
      throwError(() => new Error('Current request failed'))
    );

    await store.loadFixture(42);

    expect(store.fixture()).toBeNull();
    expect(store.isLoading()).toBe(false);
    expect(store.error()).toBe('Current request failed');
  });

  it('orders goal and red-card highlights including missed penalties without mutating events', async () => {
    const fixture = createFixture();
    httpMock.getFixture.mockReturnValue(of(fixture));
    await store.loadFixture(42);

    const lateGoal = createEvent('Goal', 'Normal Goal', 90, 4);
    const yellowCard = createEvent('Card', 'Yellow Card', 15);
    const redCard = createEvent('Card', 'Red Card', 90, 2);
    const missedPenalty = createEvent('Goal', 'Missed Penalty', 30);
    const events = [lateGoal, yellowCard, redCard, missedPenalty];

    store.updateHighlights(events);

    expect(store.fixture()?.highlights).toEqual([
      missedPenalty,
      redCard,
      lateGoal,
    ]);
    expect(events).toEqual([lateGoal, yellowCard, redCard, missedPenalty]);
    expect(fixture.highlights).toEqual([]);
  });

  it('clears highlights when the fixture has no events', async () => {
    const fixture = createFixture();
    httpMock.getFixture.mockReturnValue(of(fixture));
    await store.loadFixture(42);
    store.updateHighlights([createEvent('Goal', 'Normal Goal', 20)]);

    store.updateHighlights([]);

    expect(store.fixture()?.highlights).toEqual([]);
  });

  it('updates highlights when the separately loaded events arrive later', async () => {
    let onEventsLoaded: ((events: EventDTO[]) => void) | undefined;
    eventsStoreMock.loadEvents.mockImplementation((options) => {
      onEventsLoaded = options.onEventsLoaded;
    });
    httpMock.getFixture.mockReturnValue(of(createFixture()));

    await store.loadFixture(42);

    expect(store.fixture()?.highlights).toEqual([]);

    const goal = createEvent('Goal', 'Normal Goal', 20);
    onEventsLoaded?.([goal]);

    expect(store.fixture()?.highlights).toEqual([goal]);
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
  elapsed: number,
  extra: number | null = null
): EventDTO {
  return {
    time: { elapsed, extra },
    team: { ...EXAMPLE_FIXTURE.teams.home, goals: 0 },
    player: { id: 1, name: 'Player' },
    assist: { id: null, name: '' },
    type,
    detail,
    comments: '',
  };
}
