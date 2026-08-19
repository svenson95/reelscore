import { Component, signal } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';

import {
  LeagueService,
  RouteService,
  SELECT_COMPETITION_DATA_FLAT,
} from '@app/shared';

import { CompetitionRouteContext } from './competition-route-context';

@Component({
  template: '',
})
class TestCompetitionComponent extends CompetitionRouteContext {}

describe('CompetitionRouteContext', () => {
  const route = signal<string | undefined>(undefined);

  const leagueServiceMock = {
    selectedLeague: signal(undefined),
    setSelectedLeague: jest.fn(),
  };

  const routeServiceMock = {
    url: route.asReadonly(),
  };

  let fixture: ComponentFixture<TestCompetitionComponent>;

  beforeEach(() => {
    route.set(undefined);
    leagueServiceMock.setSelectedLeague.mockClear();

    TestBed.configureTestingModule({
      imports: [TestCompetitionComponent],
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

    fixture = TestBed.createComponent(TestCompetitionComponent);

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

  it('should clear selected competition on destroy', () => {
    const competition = SELECT_COMPETITION_DATA_FLAT[0];

    route.set(`/competition/${competition.url}`);
    TestBed.tick();

    leagueServiceMock.setSelectedLeague.mockClear();

    fixture.destroy();

    expect(leagueServiceMock.setSelectedLeague).toHaveBeenCalledTimes(1);
    expect(leagueServiceMock.setSelectedLeague).toHaveBeenCalledWith(undefined);
  });

  it('should clear selected competition if competition does not exist', () => {
    route.set('/competition/does-not-exist');

    TestBed.tick();

    expect(leagueServiceMock.setSelectedLeague).toHaveBeenLastCalledWith(
      undefined
    );
  });
});
