import { CompetitionFixtures } from '.';

export class FilteredCompetitions extends Array<CompetitionFixtures> {
  competitions: CompetitionFixtures[];

  constructor(competitions: CompetitionFixtures[]) {
    super();
    this.competitions = competitions;
  }

  byLeague(query: string | undefined): FilteredCompetitions {
    const filtered = this.competitions.filter((c) => c.name === query);
    return new FilteredCompetitions(query ? filtered : this.competitions);
  }
}
