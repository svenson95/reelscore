import {
  CompetitionFixtures,
  DateString,
  Match,
  isSameDay,
} from '../../../models';

export class FilteredCompetitions extends Array<CompetitionFixtures> {
  competitions: CompetitionFixtures[];

  constructor(competitions: CompetitionFixtures[]) {
    super();
    this.competitions = competitions;
  }

  byDay(day: DateString): FilteredCompetitions {
    const isSameDate = (m: Match) => isSameDay(m.date, new Date(day));
    const filtered: CompetitionFixtures[] = this.competitions
      .filter((c: CompetitionFixtures) => c.fixtures.some(isSameDate))
      .map((c: CompetitionFixtures) => filteredFixtures(c, isSameDate));

    return new FilteredCompetitions(filtered);
  }

  byLeague(query: string | undefined): FilteredCompetitions {
    const filtered = this.competitions.filter((c) => c.name === query);
    return new FilteredCompetitions(query ? filtered : this.competitions);
  }
}

const filteredFixtures = (
  c: CompetitionFixtures,
  isSameDate: (m: Match) => boolean
): CompetitionFixtures => ({
  ...c,
  fixtures: c.fixtures.filter(isSameDate),
});
