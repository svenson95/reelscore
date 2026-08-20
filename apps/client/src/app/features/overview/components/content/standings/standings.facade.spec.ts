import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import type { StandingsDTO } from '@lib/models';
import { COMPETITION_ID } from '@lib/shared';

import { EXAMPLE_STANDINGS } from '../../../../../../testing/standings.mock';
import { FilterService } from '../../../services';
import { FilteredStandingsStore } from '../../../stores';

import { OverviewStandingsFacade } from './standings.facade';

describe('OverviewStandingsFacade', () => {
  const standings = signal<StandingsDTO | null>(null);

  const standingsStoreMock = {
    standings: standings.asReadonly(),
  };

  let facade: OverviewStandingsFacade;
  let filterService: FilterService;

  beforeEach(() => {
    standings.set(null);

    TestBed.configureTestingModule({
      providers: [
        OverviewStandingsFacade,
        FilterService,
        {
          provide: FilteredStandingsStore,
          useValue: standingsStoreMock,
        },
      ],
    });

    facade = TestBed.inject(OverviewStandingsFacade);
    filterService = TestBed.inject(FilterService);
  });

  it('should expose standings from the store', () => {
    standings.set(EXAMPLE_STANDINGS);

    expect(facade.dayStandings()).toBe(EXAMPLE_STANDINGS);
  });

  it('should expose the competition filter state', () => {
    expect(facade.isFiltering()).toBe(false);

    filterService.selectedCompetition.set(EXAMPLE_STANDINGS.league.id);

    expect(facade.isFiltering()).toBe(true);

    filterService.selectedCompetition.set(null);

    expect(facade.isFiltering()).toBe(false);
  });

  it('should not report multiple groups without standings', () => {
    expect(facade.hasMultipleGroups()).toBe(false);
  });

  it('should not show home and away standings without standings', () => {
    expect(facade.showHomeAndAwayStandings()).toBe(false);
  });

  it('should not report multiple groups for regular standings', () => {
    standings.set(EXAMPLE_STANDINGS);

    expect(facade.hasMultipleGroups()).toBe(false);
  });

  it('should report multiple groups for competitions with multiple groups in older seasons', () => {
    standings.set({
      ...EXAMPLE_STANDINGS,
      league: {
        ...EXAMPLE_STANDINGS.league,
        id: COMPETITION_ID.EUROPA_UEFA_CHAMPIONS_LEAGUE,
        season: 2023,
      },
    });

    expect(facade.hasMultipleGroups()).toBe(true);
  });

  it('should not report multiple groups for competitions using the league format', () => {
    standings.set({
      ...EXAMPLE_STANDINGS,
      league: {
        ...EXAMPLE_STANDINGS.league,
        id: COMPETITION_ID.EUROPA_UEFA_CHAMPIONS_LEAGUE,
        season: 2024,
      },
    });

    expect(facade.hasMultipleGroups()).toBe(false);
  });

  it('should show home and away standings when three standings groups are available', () => {
    standings.set(EXAMPLE_STANDINGS);

    expect(facade.showHomeAndAwayStandings()).toBe(true);
  });
});
