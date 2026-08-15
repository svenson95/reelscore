import { TestBed } from '@angular/core/testing';

import type { ExtendedFixtureDTO } from '@lib/models';

import { EXAMPLE_FIXTURE } from '../../../../../../../testing/fixtures.mock';
import { AbstractedFilterService, FilterService } from '../../../../services';

import { OverviewFixturesFacade } from './fixtures.facade';

const CHAMPIONS_LEAGUE_FIXTURE: ExtendedFixtureDTO = EXAMPLE_FIXTURE;

const BUNDESLIGA_FIXTURE: ExtendedFixtureDTO = {
  ...CHAMPIONS_LEAGUE_FIXTURE,
  fixture: {
    ...CHAMPIONS_LEAGUE_FIXTURE.fixture,
    id: 2000001,
  },
  league: {
    ...CHAMPIONS_LEAGUE_FIXTURE.league,
    id: 78,
    name: 'Bundesliga',
    round: 'Regular Season - 1',
  },
};

describe('OverviewFixturesFacade', () => {
  let facade: OverviewFixturesFacade;
  let filterService: FilterService;

  const fixtures = [CHAMPIONS_LEAGUE_FIXTURE, BUNDESLIGA_FIXTURE];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OverviewFixturesFacade,
        {
          provide: FilterService,
          useClass: AbstractedFilterService,
        },
      ],
    });

    facade = TestBed.inject(OverviewFixturesFacade);
    filterService = TestBed.inject(FilterService);
  });

  it('should return fixtures from all competitions when no competition filter is selected', () => {
    const competitions = facade.initCompetitionsWithFixtures(fixtures);

    expect(competitions).toHaveLength(2);

    expect(competitions.map((competition) => competition.id)).toEqual(
      expect.arrayContaining([2, 78])
    );
  });

  it('should return only fixtures from the selected competition', () => {
    filterService.selectedCompetition.set(78);

    const competitions = facade.initCompetitionsWithFixtures(fixtures);

    expect(competitions).toHaveLength(1);
    expect(competitions[0].id).toBe(78);
    expect(competitions[0].fixtures).toEqual([BUNDESLIGA_FIXTURE]);
  });

  it('should restore fixtures from all competitions after clearing the filter', () => {
    filterService.selectedCompetition.set(78);

    expect(facade.initCompetitionsWithFixtures(fixtures)).toHaveLength(1);

    filterService.selectedCompetition.set(null);

    const competitions = facade.initCompetitionsWithFixtures(fixtures);

    expect(competitions).toHaveLength(2);

    expect(competitions.map((competition) => competition.id)).toEqual(
      expect.arrayContaining([2, 78])
    );
  });

  it('should group fixtures of the same competition and round together', () => {
    const secondChampionsLeagueFixture: ExtendedFixtureDTO = {
      ...CHAMPIONS_LEAGUE_FIXTURE,
      fixture: {
        ...CHAMPIONS_LEAGUE_FIXTURE.fixture,
        id: 1544372,
      },
    };

    const competitions = facade.initCompetitionsWithFixtures([
      CHAMPIONS_LEAGUE_FIXTURE,
      secondChampionsLeagueFixture,
    ]);

    expect(competitions).toHaveLength(1);
    expect(competitions[0].fixtures).toHaveLength(2);
  });

  it('should create separate groups for different rounds of the same competition', () => {
    const semiFinalFixture: ExtendedFixtureDTO = {
      ...CHAMPIONS_LEAGUE_FIXTURE,
      fixture: {
        ...CHAMPIONS_LEAGUE_FIXTURE.fixture,
        id: 1544372,
      },
      league: {
        ...CHAMPIONS_LEAGUE_FIXTURE.league,
        round: 'Semi-finals',
      },
    };

    const competitions = facade.initCompetitionsWithFixtures([
      CHAMPIONS_LEAGUE_FIXTURE,
      semiFinalFixture,
    ]);

    expect(competitions).toHaveLength(2);
  });
});
