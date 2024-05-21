import {
  COMPETITION_LABEL,
  MATCH_EXAMPLES,
  MATCH_EXAMPLES_2,
} from '../../../constants';
import { Competition } from '../../../models';

export const COMPETITION_EXAMPLES: Competition[] = [
  {
    name: COMPETITION_LABEL.GERMANY_BUNDESLIGA,
    list: MATCH_EXAMPLES,
  },
  {
    name: COMPETITION_LABEL.SPAIN_LA_LIGA,
    list: MATCH_EXAMPLES_2,
  },
];
