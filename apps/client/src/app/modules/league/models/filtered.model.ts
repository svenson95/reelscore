import { Competition, DateString, Match, isSameDay } from '../../../models';

export class FilteredCompetitions extends Array<Competition> {
  competitions: Competition[];

  constructor(competitions: Competition[]) {
    super();
    this.competitions = competitions;
  }

  byDay(day: DateString): FilteredCompetitions {
    const isSameDate = (m: Match) => isSameDay(m.date, new Date(day));
    const filtered = this.competitions
      .filter((c: Competition) => c.list.some(isSameDate))
      .map((c: Competition) => ({
        ...c,
        list: c.list.filter(isSameDate),
      }));

    return new FilteredCompetitions(filtered);
  }

  byLeague(query: string | undefined): FilteredCompetitions {
    const filtered = this.competitions.filter((c) => c.name === query);
    return new FilteredCompetitions(query ? filtered : this.competitions);
  }
}
