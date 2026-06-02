import { COMPETITION_ID } from '@lib/constants';
import type { CompetitionRound } from '@lib/models';

import {
  CHAMPIONS_LEAGUE_FROM_2025_ROUND_MAP,
  DEFAULT_ROUND_MAP,
  LEAGUE_RELEGATION_ROUND_MAP,
} from './data';

export type LabelType = 'default' | 'header';

export type RoundLabelContext = {
  type?: LabelType;
  id: number;
  season: number;
};

type RoundLabelTranslation = {
  default: CompetitionRound;
  header: CompetitionRound;
};

type RoundLabelFactory = (round: CompetitionRound) => RoundLabelTranslation;

type RoundMap = Record<CompetitionRound, RoundLabelFactory>;
export type RoundMapOverride = Partial<RoundMap>;

type RoundMapRule = {
  type?: LabelType;
  id: number;
  fromSeason: number;
  map: RoundMapOverride;
};

const RELEGATION_COMPETITION_IDS = [
  COMPETITION_ID.GERMANY_BUNDESLIGA,
  COMPETITION_ID.GERMANY_BUNDESLIGA_2,
  COMPETITION_ID.ITALY_SERIE_A,
  COMPETITION_ID.FRANCE_LIGUE_1,
  COMPETITION_ID.SPAIN_LA_LIGA,
  COMPETITION_ID.ENGLAND_PREMIER_LEAGUE,
];

const createRoundMapRules = (
  competitionIds: number[],
  fromSeason: number,
  map: RoundMapOverride
): RoundMapRule[] =>
  competitionIds.map((id) => ({
    id,
    fromSeason,
    map,
  }));

const ROUND_MAP_RULES: RoundMapRule[] = [
  {
    id: COMPETITION_ID.EUROPA_UEFA_CHAMPIONS_LEAGUE,
    fromSeason: 2025,
    map: CHAMPIONS_LEAGUE_FROM_2025_ROUND_MAP,
  },

  ...createRoundMapRules(
    RELEGATION_COMPETITION_IDS,
    0,
    LEAGUE_RELEGATION_ROUND_MAP
  ),
];

const getBestRoundMapRule = (
  context: RoundLabelContext
): RoundMapRule | undefined => {
  if (!context.id || typeof context.season !== 'number') {
    return undefined;
  }

  let bestRule: RoundMapRule | undefined;

  for (const rule of ROUND_MAP_RULES) {
    const isSameCompetition = rule.id === context.id;
    const isValidForSeason = rule.fromSeason <= context.season;
    const isNewerThanCurrentBest =
      !bestRule || rule.fromSeason > bestRule.fromSeason;

    if (isSameCompetition && isValidForSeason && isNewerThanCurrentBest) {
      bestRule = rule;
    }
  }

  return bestRule;
};

const getRoundMap = (context: RoundLabelContext): RoundMap => {
  const rule = getBestRoundMapRule(context);

  if (!rule) {
    return DEFAULT_ROUND_MAP;
  }

  return {
    ...DEFAULT_ROUND_MAP,
    ...rule.map,
  };
};

const getType = (
  round: CompetitionRound,
  roundMap: RoundMap
): CompetitionRound => {
  const roundTypes = Object.keys(roundMap);

  for (const type of roundTypes) {
    if (round.includes(type)) {
      return type;
    }
  }

  return '';
};

export const getCompetitionRoundLabel = (
  round: CompetitionRound,
  context: RoundLabelContext
): CompetitionRound => {
  const roundMap = getRoundMap(context);
  const labelType = context.type ?? 'default';
  const type = getType(round, roundMap);
  const translation = roundMap[type](round);
  return translation?.[labelType] ?? round;
};

// data helper
export const roundNumber = (round: CompetitionRound): CompetitionRound => {
  const idx = round.lastIndexOf('-') + 2;
  return round.slice(idx);
};

export const leagueLabel = (value: CompetitionRound): CompetitionRound => {
  const roundIdx = value.indexOf('-') + 2;
  const round = value.slice(roundIdx);
  const group = value.slice('League'.length, roundIdx - 2);

  return `Liga ${group} - ${round}. Spieltag`;
};

export const groupLabel = (value: CompetitionRound): CompetitionRound => {
  const roundIdx = value.indexOf('-') + 2;
  const round = value.slice(roundIdx);
  const group = value.slice('Group'.length, roundIdx - 2);

  return `Gruppe ${group} - ${round}. Spieltag`;
};

// comp helper
export const isFirstCompetitionRound = (
  round: CompetitionRound,
  context: RoundLabelContext
): boolean => {
  const roundMap = getRoundMap(context);
  const type = getType(round, roundMap);

  if (!type) {
    return false;
  }

  if (type === '1st Round' || type === 'Preliminary Round') {
    return true;
  }

  return roundNumber(round) === '1';
};
