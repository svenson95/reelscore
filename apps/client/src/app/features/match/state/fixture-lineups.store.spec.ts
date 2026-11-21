import { TestBed } from '@angular/core/testing';

import { Subject } from 'rxjs';

import type { MatchLineupsResult } from '@reelscore-sdk/models';

import { HttpFixtureLineupsService } from '../data-access';

import { FixtureLineupsStore } from './fixture-lineups.store';

describe('FixtureLineupsStore', () => {
  let store: FixtureLineupsStore;
  let requests: Subject<MatchLineupsResult>[];

  beforeEach(() => {
    requests = [];
    TestBed.configureTestingModule({
      providers: [
        FixtureLineupsStore,
        {
          provide: HttpFixtureLineupsService,
          useValue: {
            getLineups: () => {
              const request = new Subject<MatchLineupsResult>();
              requests.push(request);
              return request;
            },
          },
        },
      ],
    });
    store = TestBed.inject(FixtureLineupsStore);
  });

  it('keeps data on refresh and reports a refresh error', () => {
    const data = { lineups: [], playerStatistics: [] };
    store.loadLineups(1);
    requests[0].next(data);

    store.loadLineups(1);
    expect(store.data()).toEqual(data);
    requests[1].error(new Error('Unavailable'));

    expect(store.data()).toEqual(data);
    expect(store.error()).toBe(true);
    expect(store.loading()).toBe(false);
  });

  it('clears the previous fixture and ignores its cancelled response', () => {
    store.loadLineups(1);
    store.loadLineups(2);
    requests[0].next({ lineups: [], playerStatistics: [] });

    expect(store.data()).toBeNull();
    expect(store.loading()).toBe(true);
    requests[1].next({ lineups: [], playerStatistics: [] });
    expect(store.loading()).toBe(false);
  });

  it('cancels an active request', () => {
    store.loadLineups(1);
    store.cancel();
    requests[0].next({ lineups: [], playerStatistics: [] });

    expect(store.data()).toBeNull();
  });
});
