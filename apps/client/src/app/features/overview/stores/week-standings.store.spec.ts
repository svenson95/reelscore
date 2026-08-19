import { TestBed } from '@angular/core/testing';
import { of, Subject, throwError } from 'rxjs';

import { HttpStandingsService } from '@app/shared';
import type { StandingsDTO, StandingsWeekData } from '@lib/models';
import { COMPETITION_ID, COMPETITION_LABEL } from '@lib/shared';

import { WeekStandingsStore } from './week-standings.store';

const testDate = '2026-08-17';
const nextWeekDate = '2026-08-24';
const testDateTime = `${testDate}T00:00:00+00:00`;
const testDateUtc = new Date(`${testDate}T00:00:00.000Z`);

const testLeagueId = COMPETITION_ID.GERMANY_BUNDESLIGA;
const testLeagueName = COMPETITION_LABEL.GERMANY_BUNDESLIGA;
const testSeason = 2026;
const testTeamId = 157; // Bayern Munich

describe('WeekStandingsStore', () => {
  let store: InstanceType<typeof WeekStandingsStore>;

  let httpMock: {
    getWeekStandings: jest.Mock;
  };

  beforeEach(() => {
    httpMock = {
      getWeekStandings: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        WeekStandingsStore,
        {
          provide: HttpStandingsService,
          useValue: httpMock,
        },
      ],
    });

    store = TestBed.inject(WeekStandingsStore);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should load standings for the selected week', () => {
    const weekStandings = createWeekStandings();

    httpMock.getWeekStandings.mockReturnValue(of(weekStandings));

    store.loadWeekStandings(testDate);

    expect(httpMock.getWeekStandings).toHaveBeenCalledWith(testDate);
    expect(store.weekStandings()).toBe(weekStandings);
    expect(store.isPending()).toBe(false);
    expect(store.error()).toBeNull();
  });

  it('should expose loading state while loading a new week', () => {
    const response$ = new Subject<StandingsWeekData>();

    httpMock.getWeekStandings.mockReturnValue(response$);

    store.loadWeekStandings(testDate);

    expect(store.isLoading()).toBe(true);
    expect(store.isRefreshing()).toBe(false);
    expect(store.isPending()).toBe(true);

    response$.next(createWeekStandings());

    expect(store.isLoading()).toBe(false);
    expect(store.isPending()).toBe(false);
  });

  it('should preserve existing standings while refreshing', () => {
    const currentWeek = createWeekStandings();
    const refreshedWeek = createWeekStandings();
    const refresh$ = new Subject<StandingsWeekData>();

    httpMock.getWeekStandings
      .mockReturnValueOnce(of(currentWeek))
      .mockReturnValueOnce(refresh$);

    store.loadWeekStandings(testDate);
    store.loadWeekStandings(testDate, true);

    expect(store.weekStandings()).toBe(currentWeek);
    expect(store.isRefreshing()).toBe(true);
    expect(store.isPending()).toBe(true);

    refresh$.next(refreshedWeek);

    expect(store.weekStandings()).toBe(refreshedWeek);
    expect(store.isRefreshing()).toBe(false);
    expect(store.isPending()).toBe(false);
  });

  it('should ignore the response of an outdated request', () => {
    const firstRequest$ = new Subject<StandingsWeekData>();
    const secondRequest$ = new Subject<StandingsWeekData>();

    const firstWeek = createWeekStandings();
    const secondWeek = createWeekStandings();

    httpMock.getWeekStandings
      .mockReturnValueOnce(firstRequest$)
      .mockReturnValueOnce(secondRequest$);

    store.loadWeekStandings(testDate);
    store.loadWeekStandings(nextWeekDate);

    secondRequest$.next(secondWeek);
    firstRequest$.next(firstWeek);

    expect(store.weekStandings()).toBe(secondWeek);
  });

  it('should preserve existing standings when loading a new week fails', async () => {
    jest.useFakeTimers();

    const existingStandings = createWeekStandings();
    const error = new Error('Request failed');

    httpMock.getWeekStandings
      .mockReturnValueOnce(of(existingStandings))
      .mockReturnValueOnce(throwError(() => error));

    store.loadWeekStandings(testDate);
    store.loadWeekStandings(nextWeekDate);

    await jest.runAllTimersAsync();

    expect(store.weekStandings()).toBe(existingStandings);
    expect(store.isLoading()).toBe(false);
    expect(store.isPending()).toBe(false);
    expect(store.error()).toBe(error);
  });

  it('should preserve existing standings when refreshing fails', async () => {
    jest.useFakeTimers();

    const currentWeek = createWeekStandings();
    const error = new Error('Failed to refresh standings');

    httpMock.getWeekStandings
      .mockReturnValueOnce(of(currentWeek))
      .mockReturnValueOnce(throwError(() => error));

    store.loadWeekStandings(testDate);
    store.loadWeekStandings(testDate, true);

    await jest.runAllTimersAsync();

    expect(store.weekStandings()).toBe(currentWeek);
    expect(store.isRefreshing()).toBe(false);
    expect(store.isPending()).toBe(false);
    expect(store.error()).toBe(error);
  });
});

function createEmptyWeekStandings(): StandingsWeekData {
  return Array.from({ length: 7 }, () => []);
}

function createWeekStandings(): StandingsWeekData {
  const weekStandings = createEmptyWeekStandings();

  weekStandings[0] = [createStandings()];

  return weekStandings;
}

function createStandings(): StandingsDTO {
  return {
    _id: `standings-${testLeagueId}`,
    league: {
      id: testLeagueId,
      name: testLeagueName,
      country: 'Germany',
      logo: `https://example.com/leagues/${testLeagueId}.png`,
      flag: 'https://example.com/flag.svg',
      season: testSeason,
      standings: [
        [
          {
            rank: 1,
            team: {
              id: testTeamId,
              name: 'Test Team',
              logo: 'https://example.com/team.png',
            },
            points: 3,
            goalsDiff: 1,
            group: testLeagueName,
            form: 'W',
            status: 'same',
            description: null,
            all: createTeamStats(),
            home: createTeamStats(),
            away: createTeamStats(),
            update: testDateTime,
          },
        ],
      ],
    },
    createdAt: testDateUtc,
    updatedAt: testDateUtc,
  };
}

function createTeamStats() {
  return {
    played: 1,
    win: 1,
    draw: 0,
    lose: 0,
    goals: {
      for: 2,
      against: 1,
    },
  };
}
