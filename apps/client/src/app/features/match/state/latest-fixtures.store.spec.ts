import { TestBed } from '@angular/core/testing';

import { Subject } from 'rxjs';

import type { LatestFixturesDTO } from '@reelscore-sdk/models';

import { EXAMPLE_FIXTURE } from '@testing/client';

import { HttpLatestFixturesService } from '../data-access';

import { LatestFixturesStore } from './latest-fixtures.store';

describe('LatestFixturesStore', () => {
  let store: InstanceType<typeof LatestFixturesStore>;
  const httpMock = { getLatestFixtures: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        LatestFixturesStore,
        { provide: HttpLatestFixturesService, useValue: httpMock },
      ],
    });
    store = TestBed.inject(LatestFixturesStore);
  });

  it('should expose loading until the latest fixtures arrive', () => {
    const response$ = new Subject<LatestFixturesDTO>();
    const latestFixtures: LatestFixturesDTO = {
      home: [EXAMPLE_FIXTURE],
      away: [],
    };
    httpMock.getLatestFixtures.mockReturnValue(response$);
    store.loadLatestFixtures(42);

    expect(store.isLoading()).toBe(true);

    response$.next(latestFixtures);

    expect(store.latestFixtures()).toBe(latestFixtures);
    expect(store.isLoading()).toBe(false);
    expect(store.error()).toBeNull();
  });

  it.each(['response', 'error'] as const)(
    'should ignore a %s from a previous fixture request',
    (previousResult) => {
      const previousResponse$ = new Subject<LatestFixturesDTO>();
      const currentResponse$ = new Subject<LatestFixturesDTO>();
      const previousFixtures: LatestFixturesDTO = {
        home: [EXAMPLE_FIXTURE],
        away: [],
      };
      const currentFixtures: LatestFixturesDTO = {
        home: [],
        away: [EXAMPLE_FIXTURE],
      };
      httpMock.getLatestFixtures
        .mockReturnValueOnce(previousResponse$)
        .mockReturnValueOnce(currentResponse$);

      store.loadLatestFixtures(42);
      store.loadLatestFixtures(84);
      currentResponse$.next(currentFixtures);
      currentResponse$.complete();
      if (previousResult === 'error') {
        previousResponse$.error(new Error('Previous request failed'));
      } else {
        previousResponse$.next(previousFixtures);
        previousResponse$.complete();
      }

      expect(store.latestFixtures()).toBe(currentFixtures);
      expect(store.isLoading()).toBe(false);
      expect(store.error()).toBeNull();
    }
  );

  it('should ignore a pending response after resetting the store', () => {
    const response$ = new Subject<LatestFixturesDTO>();
    httpMock.getLatestFixtures.mockReturnValue(response$);
    store.loadLatestFixtures(42);

    store.reset();
    response$.next({ home: [EXAMPLE_FIXTURE], away: [] });
    response$.complete();

    expect(store.latestFixtures()).toBeNull();
    expect(store.isLoading()).toBe(false);
    expect(store.error()).toBeNull();
  });

  it('should clear previous fixtures when the current request fails', () => {
    const previousResponse$ = new Subject<LatestFixturesDTO>();
    const currentResponse$ = new Subject<LatestFixturesDTO>();
    const error = new Error('Current request failed');
    httpMock.getLatestFixtures
      .mockReturnValueOnce(previousResponse$)
      .mockReturnValueOnce(currentResponse$);
    store.loadLatestFixtures(42);
    previousResponse$.next({ home: [EXAMPLE_FIXTURE], away: [] });
    previousResponse$.complete();

    store.loadLatestFixtures(84);
    currentResponse$.error(error);

    expect(store.latestFixtures()).toBeNull();
    expect(store.isLoading()).toBe(false);
    expect(store.error()).toBe(error);
  });

  it('should reject a missing fixture id without starting a request', () => {
    store.loadLatestFixtures('');

    expect(httpMock.getLatestFixtures).not.toHaveBeenCalled();
    expect(store.latestFixtures()).toBeNull();
    expect(store.isLoading()).toBe(false);
    expect(store.error()).toBe('FixtureId in fixture store not defined');
  });
});
