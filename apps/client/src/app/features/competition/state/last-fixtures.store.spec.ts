import { type ProviderToken } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Subject, throwError } from 'rxjs';

import { COMPETITION_ID } from '@reelscore-sdk/constants';

import { HttpLastFixturesService } from '../data-access';

import { LastFixturesStore } from './last-fixtures.store';

describe('Last fixtures store', () => {
  it('loads recent fixtures, exposes loading, and tracks the show-all selection', () => {
    const response = new Subject<[]>();
    const requestError = new Error('Recent fixtures request failed');
    const http = {
      getLastFixturesForCompetition: jest
        .fn()
        .mockReturnValueOnce(response)
        .mockReturnValueOnce(throwError(() => requestError)),
    };
    const store = createStore(LastFixturesStore, HttpLastFixturesService, http);

    store.loadLastFixtures(COMPETITION_ID.GERMANY_BUNDESLIGA, true);

    expect(http.getLastFixturesForCompetition).toHaveBeenCalledWith(
      COMPETITION_ID.GERMANY_BUNDESLIGA,
      true
    );
    expect(store.isLoading()).toBe(true);
    expect(store.showAll()).toBe(true);

    response.next([]);
    response.complete();

    expect(store.fixtures()).toEqual([]);
    expect(store.isLoading()).toBe(false);
    expect(store.error()).toBeNull();

    store.loadLastFixtures(COMPETITION_ID.GERMANY_BUNDESLIGA);

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
