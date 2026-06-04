import type { CompetitionId, CompetitionSeason } from '@lib/models';
import { SEASONS } from '@lib/models';
import { COMPETITION_ID } from '@lib/shared';

import {
  CHAMPIONS_LEAGUE_FROM_2025_ROUND_MAP,
  LEAGUE_RELEGATION_ROUND_MAP,
} from './data';
import type { RoundMap, RoundMapRule } from './round-label.helper';

const RELEGATION_COMPETITION_IDS = [
  COMPETITION_ID.GERMANY_BUNDESLIGA,
  COMPETITION_ID.GERMANY_BUNDESLIGA_2,
  COMPETITION_ID.ITALY_SERIE_A,
  COMPETITION_ID.FRANCE_LIGUE_1,
  COMPETITION_ID.SPAIN_LA_LIGA,
  COMPETITION_ID.ENGLAND_PREMIER_LEAGUE,
];

const createRoundMapRules = ({
  ids,
  fromSeason,
  map,
}: {
  ids: CompetitionId[];
  fromSeason: CompetitionSeason;
  map: RoundMap;
}): RoundMapRule[] => {
  return ids.map((id) => ({
    id,
    fromSeason,
    map,
  }));
};

export const ROUND_MAP_RULES: RoundMapRule[] = [
  {
    id: COMPETITION_ID.EUROPA_UEFA_CHAMPIONS_LEAGUE,
    fromSeason: 2025,
    map: CHAMPIONS_LEAGUE_FROM_2025_ROUND_MAP,
  },

  ...createRoundMapRules({
    ids: RELEGATION_COMPETITION_IDS,
    fromSeason: SEASONS[0],
    map: LEAGUE_RELEGATION_ROUND_MAP,
  }),
];
