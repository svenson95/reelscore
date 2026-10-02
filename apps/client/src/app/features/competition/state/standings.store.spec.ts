import { type ProviderToken } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { of, throwError } from 'rxjs';

import { COMPETITION_ID } from '@reelscore-sdk/constants';

import { HttpStandingsService } from '@app/shared';

import { CompetitionStandingsStore } from './standings.store';

describe('Standings store', () => {
  it('loads standings and leaves the store ready after an empty response', () => {
    const requestError = new Error('Standings request failed');
    const http = {
      getStandings: jest
        .fn()
        .mockReturnValueOnce(of(null))
        .mockReturnValueOnce(throwError(() => requestError)),
      getWeekStandings: jest.fn(),
    };
    const store = createStore(
      CompetitionStandingsStore,
      HttpStandingsService,
      http
    );

    store.loadStandings(COMPETITION_ID.GERMANY_BUNDESLIGA, '2026-10-02');

    expect(http.getStandings).toHaveBeenCalledWith(
      COMPETITION_ID.GERMANY_BUNDESLIGA,
      '2026-10-02'
    );
    expect(store.isLoading()).toBe(false);
    expect(store.error()).toBe('CompetitionStandings not found');

    store.loadStandings(COMPETITION_ID.GERMANY_BUNDESLIGA, '2026-10-02');

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
