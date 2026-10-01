import { TestBed } from '@angular/core/testing';

import { Subject, throwError } from 'rxjs';

import type { StandingsDTO } from '@lib/models';

import { HttpFixtureStandingsService } from '../services';

import { FixtureStandingsStore } from './standings.store';

describe('FixtureStandingsStore', () => {
  let store: InstanceType<typeof FixtureStandingsStore>;
  const httpMock = { getFixtureStandings: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        FixtureStandingsStore,
        { provide: HttpFixtureStandingsService, useValue: httpMock },
      ],
    });
    store = TestBed.inject(FixtureStandingsStore);
  });

  it('should expose loading until standings arrive', () => {
    const response$ = new Subject<StandingsDTO>();
    const standings = {} as StandingsDTO;
    httpMock.getFixtureStandings.mockReturnValue(response$);
    store.loadFixtureStandings('1,2', 78, '2026-05-30');

    expect(store.isLoading()).toBe(true);

    response$.next(standings);

    expect(store.standings()).toBe(standings);
    expect(store.isLoading()).toBe(false);
    expect(store.error()).toBeNull();
  });

  it('should expose a failed standings request', () => {
    const error = new Error('Standings failed');
    httpMock.getFixtureStandings.mockReturnValue(throwError(() => error));
    store.loadFixtureStandings('1,2', 78, '2026-05-30');

    expect(store.standings()).toBeNull();
    expect(store.isLoading()).toBe(false);
    expect(store.error()).toBe(error);
  });
});
