import { TestBed } from '@angular/core/testing';

import { of, Subject, throwError } from 'rxjs';

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

  it('ignores an error from a previous match after resetting', () => {
    const response$ = new Subject<ExtendedFixtureDTO[]>();
    httpMock.getHeadToHeadFixtures.mockReturnValue(response$);

    store.loadHeadToHeadFixtures(42);
    store.reset();
    response$.error(new Error('Obsolete request failed'));

    expect(store.error()).toBeNull();
    expect(store.isLoading()).toBe(false);
  });

  it('keeps existing encounters and exposes an error when a refresh fails', () => {
    const fixtures = [EXAMPLE_FIXTURE];
    httpMock.getHeadToHeadFixtures.mockReturnValueOnce(of(fixtures));
    store.loadHeadToHeadFixtures(42);

    const error = new Error('Head-to-head request failed');
    httpMock.getHeadToHeadFixtures.mockReturnValueOnce(throwError(() => error));
    store.loadHeadToHeadFixtures(42, true);

    expect(store.headToHeadFixtures()).toBe(fixtures);
    expect(store.isLoading()).toBe(false);
    expect(store.error()).toBe(error);
  });

  it('clears encounters and exposes an error when the initial request fails', () => {
    const error = new Error('Head-to-head request failed');
    httpMock.getHeadToHeadFixtures.mockReturnValue(throwError(() => error));

    store.loadHeadToHeadFixtures(42);

    expect(store.headToHeadFixtures()).toBeNull();
    expect(store.isLoading()).toBe(false);
    expect(store.error()).toBe(error);
  });
});
