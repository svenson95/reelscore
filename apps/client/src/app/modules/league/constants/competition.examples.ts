import {
  COMPETITION_LABEL,
  MATCH_EXAMPLES,
  MATCH_EXAMPLES_2,
} from '../../../constants';
import { CompetitionFixtures } from '../../../models';

export const COMPETITION_EXAMPLES: CompetitionFixtures[] = [
  {
    name: COMPETITION_LABEL.GERMANY_BUNDESLIGA,
    fixtures: MATCH_EXAMPLES,
  },
  {
    name: COMPETITION_LABEL.SPAIN_LA_LIGA,
    fixtures: MATCH_EXAMPLES_2,
  },
];
