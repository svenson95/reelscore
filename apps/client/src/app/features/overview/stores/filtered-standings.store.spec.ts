import { TestBed } from '@angular/core/testing';
import { of, Subject, throwError } from 'rxjs';

import { HttpStandingsService } from '@app/shared';
import type { StandingsDTO } from '@lib/models';
import { COMPETITION_ID, COMPETITION_LABEL } from '@lib/shared';

import { FilteredStandingsStore } from './filtered-standings.store';

const testDate = '2026-08-17';
const testDateTime = `${testDate}T00:00:00+00:00`;
const testDateUtc = new Date(`${testDate}T00:00:00.000Z`);

const testLeagueId = COMPETITION_ID.GERMANY_BUNDESLIGA;
const testLeagueName = COMPETITION_LABEL.GERMANY_BUNDESLIGA;
const testSeason = 2026;
const testTeamId = 157;

describe('FilteredStandingsStore', () => {
  let store: InstanceType<typeof FilteredStandingsStore>;

  let httpMock: {
    getStandings: jest.Mock;
  };

  beforeEach(() => {
    httpMock = {
      getStandings: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        FilteredStandingsStore,
        {
          provide: HttpStandingsService,
          useValue: httpMock,
        },
      ],
    });

    store = TestBed.inject(FilteredStandingsStore);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should load standings for the selected competition and date', () => {
    const standings = createStandings();

    httpMock.getStandings.mockReturnValue(of(standings));

    store.loadFilteredStandings(testDate, testLeagueId);

    expect(httpMock.getStandings).toHaveBeenCalledWith(testLeagueId, testDate);

    expect(store.standings()).toBe(standings);
    expect(store.isLoading()).toBe(false);
    expect(store.error()).toBeNull();
  });

  it('should expose an error when no filtered standings exist', () => {
    httpMock.getStandings.mockReturnValue(of(null));

    store.loadFilteredStandings(testDate, testLeagueId);

    expect(store.standings()).toBeNull();
    expect(store.isLoading()).toBe(false);
    expect(store.error()).toBe('Filtered Standings not found');
  });

  it('should expose an error when loading standings fails', async () => {
    jest.useFakeTimers();

    const error = new Error('Failed to load standings');

    httpMock.getStandings.mockReturnValue(throwError(() => error));

    store.loadFilteredStandings(testDate, testLeagueId);

    await jest.runAllTimersAsync();

    expect(store.standings()).toBeNull();
    expect(store.isLoading()).toBe(false);
    expect(store.error()).toBe(error);
  });

  it('should reset the store', () => {
    const standings = createStandings();

    httpMock.getStandings.mockReturnValue(of(standings));

    store.loadFilteredStandings(testDate, testLeagueId);
    store.reset();

    expect(store.standings()).toBeNull();
    expect(store.isLoading()).toBe(false);
    expect(store.error()).toBeNull();
  });

  it('should ignore a pending response after reset', () => {
    const response$ = new Subject<StandingsDTO | null>();

    httpMock.getStandings.mockReturnValue(response$);

    store.loadFilteredStandings(testDate, testLeagueId);

    expect(store.isLoading()).toBe(true);

    store.reset();

    response$.next(null);

    expect(store.standings()).toBeNull();
    expect(store.isLoading()).toBe(false);
    expect(store.error()).toBeNull();
  });
});

const createStandings = (): StandingsDTO => ({
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
});

const createTeamStats = () => ({
  played: 1,
  win: 1,
  draw: 0,
  lose: 0,
  goals: {
    for: 2,
    against: 1,
  },
});
