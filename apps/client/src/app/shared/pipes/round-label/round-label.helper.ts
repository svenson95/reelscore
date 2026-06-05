import { type CompetitionRound, type CompetitionSeason } from '@lib/models';

import { DEFAULT_ROUND_MAP } from './data';
import { ROUND_MAP_RULES } from './round-map.data';

type LabelType = 'default' | 'header';

export type RoundLabelContext = {
  type?: LabelType;
  id: number;
  season: CompetitionSeason;
};

type RoundLabelTranslation = {
  default: CompetitionRound;
  header: CompetitionRound;
};

type RoundLabelFactory = (round: CompetitionRound) => RoundLabelTranslation;

export type RoundMap = Record<CompetitionRound, RoundLabelFactory>;
export type RoundMapOverride = Partial<RoundMap>;

export type RoundMapRule = {
  type?: LabelType;
  id: number;
  fromSeason: CompetitionSeason;
  map: RoundMapOverride;
};

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

  const translateRound = roundMap[type];

  if (!translateRound) return round;
  const translation = translateRound(round);

  return translation?.[labelType] ?? translation?.default ?? round;
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

export const groupLabelHeader = (value: CompetitionRound): CompetitionRound => {
  const roundIdx = value.indexOf('-') + 2;
  const round = value.slice(roundIdx);
  const group = value.slice('Group'.length, roundIdx - 2);

  return `#${round} Gruppe ${group}`;
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
