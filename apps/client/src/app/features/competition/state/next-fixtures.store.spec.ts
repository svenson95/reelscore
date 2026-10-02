import { type ProviderToken } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { of, throwError } from 'rxjs';

import { COMPETITION_ID } from '@reelscore-sdk/constants';

import { HttpNextFixturesService } from '../data-access';

import { NextFixturesStore } from './next-fixtures.store';

describe('Next fixtures store', () => {
  it('loads upcoming fixtures and records an empty response as valid data', () => {
    const requestError = new Error('Upcoming fixtures request failed');
    const http = {
      getNextFixturesForCompetition: jest
        .fn()
        .mockReturnValueOnce(of([]))
        .mockReturnValueOnce(throwError(() => requestError)),
    };
    const store = createStore(NextFixturesStore, HttpNextFixturesService, http);

    store.loadNextFixtures(COMPETITION_ID.GERMANY_BUNDESLIGA);

    expect(http.getNextFixturesForCompetition).toHaveBeenCalledWith(
      COMPETITION_ID.GERMANY_BUNDESLIGA
    );
    expect(store.fixtures()).toEqual([]);
    expect(store.isLoading()).toBe(false);
    expect(store.error()).toBeNull();

    store.loadNextFixtures(COMPETITION_ID.GERMANY_BUNDESLIGA);

    expect(store.isLoading()).toBe(false);
    expect(store.fixtures()).toBeNull();
    expect(store.error()).toBe(requestError);
  });
});

function createStore<TStore, TService>(
  storeType: new (...args: never[]) => TStore,
  serviceType: ProviderToken<TService>,
  serviceMock: TService
): TStore {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({
    providers: [storeType, { provide: serviceType, useValue: serviceMock }],
  });

  return TestBed.inject(storeType);
}
