import { TestBed } from '@angular/core/testing';

import { Subject } from 'rxjs';

import type { ExtendedFixtureDTO } from '@reelscore-sdk/models';

import { EXAMPLE_FIXTURE } from '@testing/client';

import { HttpHeadToHeadFixturesService } from '../data-access';

import { HeadToHeadFixturesStore } from './head-to-head-fixtures.store';

describe('HeadToHeadFixturesStore', () => {
  let store: InstanceType<typeof HeadToHeadFixturesStore>;
  const httpMock = { getHeadToHeadFixtures: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        HeadToHeadFixturesStore,
        { provide: HttpHeadToHeadFixturesService, useValue: httpMock },
      ],
    });
    store = TestBed.inject(HeadToHeadFixturesStore);
  });

  it('stores the direct encounters when the request completes', () => {
    const response$ = new Subject<ExtendedFixtureDTO[]>();
    const fixtures = [EXAMPLE_FIXTURE];
    httpMock.getHeadToHeadFixtures.mockReturnValue(response$);

    store.loadHeadToHeadFixtures(42);

    expect(store.isLoading()).toBe(true);
    response$.next(fixtures);

    expect(store.headToHeadFixtures()).toBe(fixtures);
    expect(store.isLoading()).toBe(false);
    expect(store.error()).toBeNull();
  });

  it('ignores a response from a previous match after resetting', () => {
    const response$ = new Subject<ExtendedFixtureDTO[]>();
    httpMock.getHeadToHeadFixtures.mockReturnValue(response$);

    store.loadHeadToHeadFixtures(42);
    store.reset();
    response$.next([EXAMPLE_FIXTURE]);

    expect(store.headToHeadFixtures()).toBeNull();
    expect(store.isLoading()).toBe(false);
  });
});
