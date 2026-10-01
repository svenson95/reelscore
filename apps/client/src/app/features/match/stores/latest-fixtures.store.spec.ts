import { TestBed } from '@angular/core/testing';

import { Subject } from 'rxjs';

import type { LatestFixturesDTO } from '@reelscore-sdk/models';

import { EXAMPLE_FIXTURE } from '../../../../testing/fixtures.mock';
import { HttpLatestFixturesService } from '../services';

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

  it('should reject a missing fixture id without starting a request', () => {
    store.loadLatestFixtures('');

    expect(httpMock.getLatestFixtures).not.toHaveBeenCalled();
    expect(store.latestFixtures()).toBeNull();
    expect(store.isLoading()).toBe(false);
    expect(store.error()).toBe('FixtureId in fixture store not defined');
  });
});
