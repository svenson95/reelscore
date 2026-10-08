import { TestBed } from '@angular/core/testing';

import { Subject, throwError } from 'rxjs';

import type { GetAllTeamCoachesDTO } from '@reelscore-sdk/models';

import { HttpTeamCoachesService } from '../data-access';

import { TeamCoachesStore } from './team-coaches.store';

describe(TeamCoachesStore.name, () => {
  let store: InstanceType<typeof TeamCoachesStore>;
  const httpMock = { getTeamCoaches: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        TeamCoachesStore,
        { provide: HttpTeamCoachesService, useValue: httpMock },
      ],
    });
    store = TestBed.inject(TeamCoachesStore);
  });

  it('clears prior data while loading and stores the response', () => {
    const response$ = new Subject<GetAllTeamCoachesDTO>();
    const teamCoaches = { data: [], length: 0 };
    httpMock.getTeamCoaches.mockReturnValue(response$);

    store.loadTeamCoaches('85,42');

    expect(store.isLoading()).toBe(true);
    expect(store.teamCoaches()).toBeNull();

    response$.next(teamCoaches);

    expect(store.teamCoaches()).toBe(teamCoaches);
    expect(store.isLoading()).toBe(false);
    expect(store.error()).toBeNull();
  });

  it('ignores an older response after a newer request starts', () => {
    const firstResponse$ = new Subject<GetAllTeamCoachesDTO>();
    const secondResponse$ = new Subject<GetAllTeamCoachesDTO>();
    const latestCoaches = { data: [], length: 0 };
    httpMock.getTeamCoaches
      .mockReturnValueOnce(firstResponse$)
      .mockReturnValueOnce(secondResponse$);

    store.loadTeamCoaches('85,42');
    store.loadTeamCoaches('86,43');
    secondResponse$.next(latestCoaches);
    firstResponse$.error(new Error('Stale request failed'));

    expect(store.teamCoaches()).toBe(latestCoaches);
    expect(store.isLoading()).toBe(false);
    expect(store.error()).toBeNull();
  });

  it('clears the data and exposes the error when the latest request fails', () => {
    const error = new Error('Coaches could not be loaded');
    httpMock.getTeamCoaches
      .mockReturnValueOnce(new Subject())
      .mockReturnValueOnce(throwError(() => error));

    store.loadTeamCoaches('85,42');
    store.loadTeamCoaches('86,43');

    expect(store.teamCoaches()).toBeNull();
    expect(store.isLoading()).toBe(false);
    expect(store.error()).toBe(error);
  });
});
