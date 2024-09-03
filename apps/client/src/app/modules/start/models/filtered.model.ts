import { CompetitionId } from '@lib/models';
import { CompetitionFixtures } from './match.model';

export class FilteredCompetitions extends Array<CompetitionFixtures> {
  competitions: CompetitionFixtures[];

  constructor(competitions: CompetitionFixtures[]) {
    super();
    this.competitions = competitions;
  }

  byLeague(query: CompetitionId | null): FilteredCompetitions {
    const filtered = this.competitions.filter((c) => c.id === query);
    return new FilteredCompetitions(query ? filtered : this.competitions);
  }
}
