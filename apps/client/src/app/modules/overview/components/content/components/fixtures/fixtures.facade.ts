import { inject, Injectable } from '@angular/core';

import {
  COMPETITIONS_ORDER,
  CompetitionWithFixtures,
  SELECT_COMPETITION_DATA_FLAT,
} from '@app/shared';
import { CompetitionLabel, ExtendedFixtureDTO } from '@lib/models';

import { FilterService } from '../../../../services';

@Injectable()
export class OverviewFixturesFacade {
  private filterService = inject(FilterService);

  initCompetitionsWithFixtures = (
    fixtures: Array<ExtendedFixtureDTO> | null
  ): Array<CompetitionWithFixtures> => {
    if (!fixtures) return [];
    const allCompetitions = [...new Set(fixtures.map((f) => f.league.name))];
    const competitions: Array<CompetitionWithFixtures> = allCompetitions
      .map((name) => this.groupFixturesToCompetitions(fixtures, name))
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
    name: CompetitionLabel
  ) => {
    const fixture = filteredFixtures.find((f) => f.league.name === name);
    const competition = SELECT_COMPETITION_DATA_FLAT.find(
      (c) => c.id === fixture?.league.id
    );
    if (!fixture || !competition) throw new Error(`Not found ('${name}')`);
    return {
      name,
      url: ['/', 'competition', competition.url],
      id: fixture.league.id || -1,
      image: fixture.league.flag || 'error',
      fixtures: filteredFixtures.filter((f) => f.league.name === name),
    };
  };
}
