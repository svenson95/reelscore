import { type ProviderToken } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { of, throwError } from 'rxjs';

import { COMPETITION_ID } from '@reelscore-sdk/constants';

import { HttpTopAssistsService } from '../data-access';

import { TopAssistsStore } from './top-assists.store';

describe('Top assists store', () => {
  it('loads top assists and reports missing data', () => {
    const requestError = new Error('Top assists request failed');
    const http = {
      getTopAssistsForCompetition: jest
        .fn()
        .mockReturnValueOnce(of(null))
        .mockReturnValueOnce(throwError(() => requestError)),
    };
    const store = createStore(TopAssistsStore, HttpTopAssistsService, http);

    store.loadTopAssists(COMPETITION_ID.GERMANY_BUNDESLIGA);

    expect(http.getTopAssistsForCompetition).toHaveBeenCalledWith(
      COMPETITION_ID.GERMANY_BUNDESLIGA
    );
    expect(store.topAssists()).toBeNull();
    expect(store.isLoading()).toBe(false);
    expect(store.error()).toBe('TopAssists not found');

    store.loadTopAssists(COMPETITION_ID.GERMANY_BUNDESLIGA);

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
