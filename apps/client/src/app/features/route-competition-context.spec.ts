import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  LeagueService,
  RouteService,
  SELECT_COMPETITION_DATA_FLAT,
} from '@app/shared';

import { RouteCompetitionContext } from './route-competition-context';

describe('RouteCompetitionContext', () => {
  const route = signal<string | undefined>(undefined);

  const leagueServiceMock = {
    selectedLeague: signal(undefined),
    setSelectedLeague: jest.fn(),
  };

  const routeServiceMock = {
    url: route.asReadonly(),
  };

  beforeEach(() => {
    route.set(undefined);
    leagueServiceMock.setSelectedLeague.mockClear();

    TestBed.configureTestingModule({
      providers: [
        {
          provide: LeagueService,
          useValue: leagueServiceMock,
        },
        {
          provide: RouteService,
          useValue: routeServiceMock,
        },
      ],
    });

    TestBed.runInInjectionContext(() => {
      new RouteCompetitionContext();
    });

    TestBed.tick();
  });

  it('should select competition matching the current route', () => {
    const competition = SELECT_COMPETITION_DATA_FLAT[0];

    route.set(`/competition/${competition.url}`);

    TestBed.tick();

    expect(leagueServiceMock.setSelectedLeague).toHaveBeenLastCalledWith(
      competition
    );
  });

  it('should clear selected competition if route does not contain a competition', () => {
    route.set('/2026-08-14');

    TestBed.tick();

    expect(leagueServiceMock.setSelectedLeague).toHaveBeenLastCalledWith(
      undefined
    );
  });

  it('should clear selected competition if competition does not exist', () => {
    route.set('/competition/does-not-exist');

    TestBed.tick();

    expect(leagueServiceMock.setSelectedLeague).toHaveBeenLastCalledWith(
      undefined
    );
  });
});
