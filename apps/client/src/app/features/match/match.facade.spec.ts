import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { RouteService, SELECT_COMPETITION_DATA_FLAT } from '@app/shared';
import type { GetFixtureDTO } from '@lib/models';
import { EXAMPLE_FIXTURE } from '../../../testing/fixtures.mock';

import { MatchFacade } from './match.facade';
import { FixtureStore } from './store';

describe('MatchFacade', () => {
  const routeUrl = signal<string | undefined>(undefined);
  const storeFixture = signal<GetFixtureDTO | null>(null);
  const isLoading = signal(false);
  const error = signal<string | null>(null);
  const isRefreshing = signal(false);

  const fixtureStoreMock = {
    fixture: storeFixture,
    isLoading,
    error,
    isRefreshing,
    loadFixture: jest.fn(),
    reloadFixture: jest.fn(),
  };

  const routeServiceMock = {
    url: routeUrl.asReadonly(),
  };

  const routerMock = {
    navigate: jest.fn<Promise<boolean>, [unknown[]]>(),
  };

  let facade: MatchFacade;

  beforeEach(() => {
    routeUrl.set(undefined);
    storeFixture.set(null);
    isLoading.set(false);
    error.set(null);
    isRefreshing.set(false);
    jest.clearAllMocks();
    routerMock.navigate.mockResolvedValue(true);

    TestBed.configureTestingModule({
      providers: [
        MatchFacade,
        { provide: FixtureStore, useValue: fixtureStoreMock },
        { provide: RouteService, useValue: routeServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    facade = TestBed.inject(MatchFacade);
  });

  it('should not validate the URL before fixture data is available', () => {
    facade.handleInvalidUrl('champions-league');

    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should keep a supported competition URL with the fixture date', () => {
    setLoadedFixture();
    routeUrl.set('/2026-05-30/champions-league/1544371');

    facade.handleInvalidUrl('champions-league');

    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should redirect an unsupported competition URL to the fixture route', () => {
    setLoadedFixture();
    routeUrl.set('/2026-05-30/not-a-competition/1544371');

    facade.handleInvalidUrl('not-a-competition');

    expect(routerMock.navigate).toHaveBeenCalledWith([
      '2026-05-30',
      'champions-league',
      EXAMPLE_FIXTURE.fixture.id,
    ]);
  });

  it('should redirect a wrong date to the fixture route', () => {
    setLoadedFixture();
    routeUrl.set('/2026-05-29/champions-league/1544371');

    facade.handleInvalidUrl('champions-league');

    expect(routerMock.navigate).toHaveBeenCalledWith([
      '2026-05-30',
      'champions-league',
      EXAMPLE_FIXTURE.fixture.id,
    ]);
  });

  it('should not redirect when the fixture competition is unsupported', () => {
    storeFixture.set({
      data: {
        ...EXAMPLE_FIXTURE,
        league: {
          ...EXAMPLE_FIXTURE.league,
          id: 999999,
        },
      },
      highlights: [],
    });
    routeUrl.set('/2026-05-29/champions-league/1544371');

    facade.handleInvalidUrl('champions-league');

    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  function setLoadedFixture(): void {
    const competition = SELECT_COMPETITION_DATA_FLAT.find(
      ({ id }) => id === EXAMPLE_FIXTURE.league.id
    );

    expect(competition?.url).toBe('champions-league');

    storeFixture.set({
      data: EXAMPLE_FIXTURE,
      highlights: [],
    });
  }
});
