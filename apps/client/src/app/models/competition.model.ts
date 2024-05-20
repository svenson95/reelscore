import { LEAGUES_FLAGS, LEAGUES_LABELS } from '../constants';
import { DateString, isSameDay } from './date.model';

import { MATCH_EXAMPLES, MATCH_EXAMPLES_2, Match } from './match';

export interface Competition {
  name: string;
  flag: string;
  list: Match[];
}

export const COMPETITION_EXAMPLES: Competition[] = [
  {
    name: LEAGUES_LABELS.GERMANY_BUNDESLIGA,
    flag: LEAGUES_FLAGS.GERMANY_BUNDESLIGA,
    list: MATCH_EXAMPLES,
  },
  {
    name: LEAGUES_LABELS.SPAIN_LA_LIGA,
    flag: LEAGUES_FLAGS.SPAIN_LA_LIGA,
    list: MATCH_EXAMPLES_2,
  },
];

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
