import { MATCH_EXAMPLES, MATCH_EXAMPLES_2, Match } from './match';

export interface Competition {
  name: string;
  list: Match[];
}

export const COMPETITION_EXAMPLES = [
  { name: 'Bundesliga', list: MATCH_EXAMPLES },
  { name: 'La Liga', list: MATCH_EXAMPLES_2 },
];
