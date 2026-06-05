import { inject, Injectable } from '@angular/core';

import type { CompetitionWithFixtures } from '@app/shared';
import { COMPETITIONS_ORDER, SELECT_COMPETITION_DATA_FLAT } from '@app/shared';
import type { CompetitionName, ExtendedFixtureDTO } from '@lib/models';

import { FilterService } from '../../../../services';

@Injectable()
export class OverviewFixturesFacade {
  private filterService = inject(FilterService);

  initCompetitionsWithFixtures = (
    fixtures: Array<ExtendedFixtureDTO> | null
  ): Array<CompetitionWithFixtures> => {
    if (!fixtures) return [];

    const competitionGroups = [
      ...new Map(
        fixtures.map((fixture) => [
          this.getCompetitionGroupKey(fixture),
          {
            id: fixture.league.id,
            name: fixture.league.name,
            round: fixture.league.round,
          },
        ])
      ).values(),
    ];

    const competitions: Array<CompetitionWithFixtures> = competitionGroups
      .map((group) =>
        this.groupFixturesToCompetitions(
          fixtures,
          group.id,
          group.name,
          group.round
        )
      )
      .sort((a, b) => {
        const ORDER = COMPETITIONS_ORDER;
        const endOfList = Object.keys(ORDER).length + 1;

        return (ORDER[a.name] || endOfList) - (ORDER[b.name] || endOfList);
      });

    const filter = this.filterService.selectedCompetition();
    const filtered = competitions.filter((c) => c.id === filter);

    return filter ? filtered : competitions;
  };

  private groupFixturesToCompetitions = (
    filteredFixtures: ExtendedFixtureDTO[],
    id: number,
    name: CompetitionName,
    round?: string
  ): CompetitionWithFixtures => {
    const fixture = filteredFixtures.find(
      (f) => f.league.id === id && f.league.round === round
    );

    const competition = SELECT_COMPETITION_DATA_FLAT.find(
      (c) => c.id === fixture?.league.id
    );

    if (!fixture || !competition) {
      throw new Error(`Not found ('${name}'${round ? ` - ${round}` : ''})`);
    }

    return {
      name,
      url: ['/', 'competition', competition.url],
      id: fixture.league.id || -1,
      image: fixture.league.flag || 'error',
      fixtures: filteredFixtures.filter(
        (f) => f.league.id === id && f.league.round === round
      ),
    };
  };

  private getCompetitionGroupKey = (fixture: ExtendedFixtureDTO): string => {
    return `${fixture.league.id}-${fixture.league.round ?? 'default'}`;
  };
}
