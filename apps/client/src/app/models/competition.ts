import { LEAGUES_FLAGS, LEAGUES_LABELS } from '../constants';

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
