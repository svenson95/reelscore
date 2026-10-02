import { type ProviderToken } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { of, throwError } from 'rxjs';

import { COMPETITION_ID } from '@reelscore-sdk/constants';

import { HttpTopScorersService } from '../data-access';

import { TopScorersStore } from './top-scorers.store';

describe('Top scorers store', () => {
  it('loads top scorers and reports missing data', () => {
    const requestError = new Error('Top scorers request failed');
    const http = {
      getTopScorersForCompetition: jest
        .fn()
        .mockReturnValueOnce(of(null))
        .mockReturnValueOnce(throwError(() => requestError)),
    };
    const store = createStore(TopScorersStore, HttpTopScorersService, http);

    store.loadTopScorers(COMPETITION_ID.GERMANY_BUNDESLIGA);

    expect(http.getTopScorersForCompetition).toHaveBeenCalledWith(
      COMPETITION_ID.GERMANY_BUNDESLIGA
    );
    expect(store.topScorers()).toBeNull();
    expect(store.isLoading()).toBe(false);
    expect(store.error()).toBe('TopScorers not found');

    store.loadTopScorers(COMPETITION_ID.GERMANY_BUNDESLIGA);

    expect(store.isLoading()).toBe(false);
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
