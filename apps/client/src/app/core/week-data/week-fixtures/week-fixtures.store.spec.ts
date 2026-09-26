import { TestBed } from '@angular/core/testing';
import { of, Subject, throwError } from 'rxjs';

import { HttpWeekFixturesService } from '@app/shared';
import type {
  ExtendedFixtureDTO,
  FixtureDTO,
  FixturesWeekData,
} from '@lib/models';
import { formatCalendarWeekKey } from '@lib/shared';

import { WeekFixturesStore } from './week-fixtures.store';

const testDate = '2026-08-17';
const nextWeekDate = '2026-08-24';

describe('WeekFixturesStore', () => {
  let store: InstanceType<typeof WeekFixturesStore>;

  let httpMock: {
    getWeekFixtures: jest.Mock;
  };

  beforeEach(() => {
    httpMock = {
      getWeekFixtures: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        WeekFixturesStore,
        {
          provide: HttpWeekFixturesService,
          useValue: httpMock,
        },
      ],
    });

    store = TestBed.inject(WeekFixturesStore);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should initialize with an empty week', () => {
    expect(store.weekFixtures()).toEqual(createWeekFixtures());
    expect(store.weekKey()).toBeNull();
    expect(store.isLoading()).toBe(false);
    expect(store.isRefreshing()).toBe(false);
    expect(store.isPending()).toBe(false);
    expect(store.error()).toBeNull();
  });

  it('should load fixtures for the selected week', () => {
    const weekFixtures = createWeekFixtures();

    httpMock.getWeekFixtures.mockReturnValue(of(weekFixtures));

    store.loadWeekFixtures(testDate);

    expect(httpMock.getWeekFixtures).toHaveBeenCalledWith(testDate);
    expect(store.weekFixtures()).toBe(weekFixtures);
    expect(store.weekKey()).toBe(formatCalendarWeekKey(testDate));
    expect(store.isLoading()).toBe(false);
    expect(store.isRefreshing()).toBe(false);
    expect(store.isPending()).toBe(false);
    expect(store.error()).toBeNull();
  });

  it('should expose loading state while loading a new week', () => {
    const response$ = new Subject<FixturesWeekData>();

    httpMock.getWeekFixtures.mockReturnValue(response$);

    store.loadWeekFixtures(testDate);

    expect(store.isLoading()).toBe(true);
    expect(store.isRefreshing()).toBe(false);
    expect(store.isPending()).toBe(true);

    response$.next(createWeekFixtures());

    expect(store.isLoading()).toBe(false);
    expect(store.isPending()).toBe(false);
  });

  it('should preserve existing fixtures while refreshing', () => {
    const currentWeek = createWeekFixtures();
    const refreshedWeek = createWeekFixtures();
    const refresh$ = new Subject<FixturesWeekData>();

    httpMock.getWeekFixtures
      .mockReturnValueOnce(of(currentWeek))
      .mockReturnValueOnce(refresh$);

    store.loadWeekFixtures(testDate);
    store.loadWeekFixtures(testDate, true);

    expect(store.weekFixtures()).toBe(currentWeek);
    expect(store.isLoading()).toBe(false);
    expect(store.isRefreshing()).toBe(true);
    expect(store.isPending()).toBe(true);

    refresh$.next(refreshedWeek);

    expect(store.weekFixtures()).toBe(refreshedWeek);
    expect(store.isRefreshing()).toBe(false);
    expect(store.isPending()).toBe(false);
  });

  it('should ignore the response of an outdated request', () => {
    const firstRequest$ = new Subject<FixturesWeekData>();
    const secondRequest$ = new Subject<FixturesWeekData>();

    const firstWeek = createWeekFixtures();
    const secondWeek = createWeekFixtures();

    httpMock.getWeekFixtures
      .mockReturnValueOnce(firstRequest$)
      .mockReturnValueOnce(secondRequest$);

    store.loadWeekFixtures(testDate);
    store.loadWeekFixtures(nextWeekDate);

    secondRequest$.next(secondWeek);
    firstRequest$.next(firstWeek);

    expect(store.weekFixtures()).toBe(secondWeek);
  });

  it('should preserve existing fixtures when refreshing fails', async () => {
    jest.useFakeTimers();

    const currentWeek = createWeekFixtures();
    const error = new Error('Failed to refresh fixtures');

    httpMock.getWeekFixtures
      .mockReturnValueOnce(of(currentWeek))
      .mockReturnValueOnce(throwError(() => error));

    store.loadWeekFixtures(testDate);
    store.loadWeekFixtures(testDate, true);

    await jest.runAllTimersAsync();

    expect(store.weekFixtures()).toBe(currentWeek);
    expect(store.isRefreshing()).toBe(false);
    expect(store.isPending()).toBe(false);
    expect(store.error()).toBe(error);
  });

  describe('realtime updates', () => {
    it('should update existing fixtures in a single batch', () => {
      const firstFixture = createExtendedFixture(123);
      const secondFixture = createExtendedFixture(456);

      const weekFixtures = createWeekFixtures();

      weekFixtures[4] = [firstFixture];
      weekFixtures[5] = [secondFixture];

      httpMock.getWeekFixtures.mockReturnValue(of(weekFixtures));

      store.loadWeekFixtures(testDate);

      store.updateFixtures([
        createFixtureUpdate(123, 2, 1),
        createFixtureUpdate(456, 3, 2),
      ]);

      expect(store.weekFixtures()[4][0].goals).toEqual({
        home: 2,
        away: 1,
      });

      expect(store.weekFixtures()[5][0].goals).toEqual({
        home: 3,
        away: 2,
      });
    });

    it('should preserve extended fixture data when applying updates', () => {
      const currentFixture = createExtendedFixture(123);
      const weekFixtures = createWeekFixtures();

      weekFixtures[4] = [currentFixture];

      httpMock.getWeekFixtures.mockReturnValue(of(weekFixtures));

      store.loadWeekFixtures(testDate);

      store.updateFixtures([createFixtureUpdate(123, 2, 1)]);

      const updatedFixture = store.weekFixtures()[4][0];

      expect(updatedFixture.final).toBe(currentFixture.final);
      expect(updatedFixture.prediction).toBe(currentFixture.prediction);
      expect(updatedFixture.evaluations).toBe(currentFixture.evaluations);
    });

    it('should not change state when the batch contains no matching fixtures', () => {
      const currentFixture = createExtendedFixture(123);
      const weekFixtures = createWeekFixtures();

      weekFixtures[4] = [currentFixture];

      httpMock.getWeekFixtures.mockReturnValue(of(weekFixtures));

      store.loadWeekFixtures(testDate);

      const stateBeforeUpdate = store.weekFixtures();

      store.updateFixtures([createFixtureUpdate(456, 2, 1)]);

      expect(store.weekFixtures()).toBe(stateBeforeUpdate);
    });

    it('should ignore unknown fixtures while updating known fixtures', () => {
      const currentFixture = createExtendedFixture(123);
      const weekFixtures = createWeekFixtures();

      weekFixtures[4] = [currentFixture];

      httpMock.getWeekFixtures.mockReturnValue(of(weekFixtures));

      store.loadWeekFixtures(testDate);

      store.updateFixtures([
        createFixtureUpdate(123, 2, 1),
        createFixtureUpdate(456, 4, 0),
      ]);

      expect(store.weekFixtures()[4][0].goals).toEqual({
        home: 2,
        away: 1,
      });

      const allFixtureIds = store
        .weekFixtures()
        .flat()
        .map((fixture) => fixture.fixture.id);

      expect(allFixtureIds).toEqual([123]);
    });

    it('should not change state for an empty update batch', () => {
      const currentFixture = createExtendedFixture(123);
      const weekFixtures = createWeekFixtures();

      weekFixtures[4] = [currentFixture];

      httpMock.getWeekFixtures.mockReturnValue(of(weekFixtures));

      store.loadWeekFixtures(testDate);

      const stateBeforeUpdate = store.weekFixtures();

      store.updateFixtures([]);

      expect(store.weekFixtures()).toBe(stateBeforeUpdate);
    });
  });
});

function createWeekFixtures(): FixturesWeekData {
  return Array.from({ length: 9 }, () => []);
}

function createExtendedFixture(fixtureId: number): ExtendedFixtureDTO {
  return {
    _id: 'test-id',
    fixture: {
      id: fixtureId,
      referee: '',
      timezone: 'Europe/Berlin',
      date: '2026-08-17T18:00:00+02:00',
      timestamp: 0,
      periods: {
        first: 0,
        second: 0,
      },
      venue: {
        id: null,
        name: '',
        city: '',
      },
      status: {
        long: 'Not Started',
        short: 'NS',
        elapsed: null,
        extra: null,
      },
    },
    league: {
      id: 140,
      name: 'La Liga',
      country: 'Spain',
      logo: '',
      flag: '',
      season: 2026,
      round: 'Regular Season - 1',
    },
    teams: {
      home: {
        id: 1,
        name: 'Home',
        logo: '',
        winner: false,
      },
      away: {
        id: 2,
        name: 'Away',
        logo: '',
        winner: false,
      },
    },
    goals: {
      home: 0,
      away: 0,
    },
    score: {
      halftime: {
        home: 0,
        away: 0,
      },
      fulltime: {
        home: 0,
        away: 0,
      },
      extratime: {
        home: 0,
        away: 0,
      },
      penalty: {
        home: 0,
        away: 0,
      },
    },
    final: {
      firstLegResult: null,
      winnerOfFinal: null,
    },
    prediction: {
      bet: 'home',
      qoute: 1.5,
      probability: 0.75,
      correct: null,
    },
    evaluations: {
      home: {
        performance: 'MIDDLE',
        analyses: [],
      },
      away: {
        performance: 'MIDDLE',
        analyses: [],
      },
    },
  };
}

function createFixtureUpdate(
  fixtureId: number,
  homeGoals: number,
  awayGoals: number
): FixtureDTO {
  const fixture = createExtendedFixture(fixtureId);

  return {
    _id: fixture._id,
    fixture: fixture.fixture,
    league: fixture.league,
    teams: fixture.teams,
    goals: {
      home: homeGoals,
      away: awayGoals,
    },
    score: fixture.score,
  };
}
