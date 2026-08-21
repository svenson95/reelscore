import { inject, Injectable } from '@angular/core';

import {
  COMPETITIONS_ORDER,
  SELECT_COMPETITION_DATA_FLAT,
  type CompetitionWithFixtures,
} from '@app/shared';
import type { ExtendedFixtureDTO } from '@lib/models';

import { FilterService } from '../../../services';

const COMPETITION_BY_ID = new Map(
  SELECT_COMPETITION_DATA_FLAT.map((competition) => [
    competition.id,
    competition,
  ])
);

const DEFAULT_COMPETITION_ORDER = Object.keys(COMPETITIONS_ORDER).length + 1;

@Injectable()
export class OverviewFixturesFacade {
  private readonly filterService = inject(FilterService);

  groupFixturesByCompetition(
    fixtures: ExtendedFixtureDTO[]
  ): CompetitionWithFixtures[] {
    const selectedCompetition = this.filterService.selectedCompetition();
    const groups = new Map<string, CompetitionWithFixtures>();

    for (const fixture of fixtures) {
      if (
        selectedCompetition !== null &&
        fixture.league.id !== selectedCompetition
      ) {
        continue;
      }

      const key = this.getCompetitionGroupKey(fixture);
      const existingGroup = groups.get(key);

      if (existingGroup) {
        existingGroup.fixtures.push(fixture);
        continue;
      }

      groups.set(key, this.createCompetitionGroup(fixture));
    }

    return [...groups.values()].sort(
      (a, b) => this.getCompetitionOrder(a) - this.getCompetitionOrder(b)
    );
  }

  private createCompetitionGroup(
    fixture: ExtendedFixtureDTO
  ): CompetitionWithFixtures {
    const competition = COMPETITION_BY_ID.get(fixture.league.id);

    if (!competition) {
      const round = fixture.league.round ? ` - ${fixture.league.round}` : '';

      throw new Error(`Not found ('${fixture.league.name}${round}')`);
    }

    return {
      id: fixture.league.id,
      name: fixture.league.name,
      image: fixture.league.flag ?? 'error',
      url: ['/', 'competition', competition.url],
      fixtures: [fixture],
    };
  }

  private getCompetitionOrder(competition: CompetitionWithFixtures): number {
    return COMPETITIONS_ORDER[competition.name] ?? DEFAULT_COMPETITION_ORDER;
  }

  private getCompetitionGroupKey(fixture: ExtendedFixtureDTO): string {
    return `${fixture.league.id}-${fixture.league.round ?? 'default'}`;
  }
}
