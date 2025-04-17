import { CompetitionRound } from '@lib/models';

export type LabelType = 'default' | 'header';
export type CompetitionRoundType = CompetitionRound;

const roundNumber = (round: CompetitionRound): CompetitionRound => {
  const idx = round.lastIndexOf('-') + 2;
  return round.slice(idx, round.length);
};

const leagueLabel = (value: CompetitionRound): CompetitionRound => {
  const roundIdx = value.indexOf('-') + 2;
  const round = value.slice(roundIdx, value.length);
  const group = value.slice('League'.length, roundIdx - 2);
  return `Liga ${group} - ${round}. Spieltag`;
};

const COMPETITION_ROUND_MAP: Record<
  CompetitionRoundType,
  (round: CompetitionRound) => {
    default: CompetitionRound;
    header: CompetitionRound;
  }
> = {
  'Regular Season': (round) => ({
    default: `${roundNumber(round)}. Spieltag`,
    header: `${roundNumber(round)}. Spieltag`,
  }),
  'League Stage': (round) => ({
    default: `${roundNumber(round)}. Spieltag`,
    header: `${roundNumber(round)}. Spieltag`,
  }),
  'Group Stage': (round) => ({
    default: `Gruppenphase ${roundNumber(round)}. Spieltag`,
    header: `Gruppenphase #${roundNumber(round)}`,
  }),
  '1st Round': () => ({
    default: '1. Runde',
    header: '1. Runde',
  }),
  '2nd Round': () => ({
    default: '2. Runde',
    header: '2. Runde',
  }),
  '3rd Round': () => ({
    default: '3. Runde',
    header: '3. Runde',
  }),
  '1st Qualifying Round': () => ({
    default: 'Qualifikation 1. Runde',
    header: 'Qualifikation #1',
  }),
  '2nd Qualifying Round': () => ({
    default: 'Qualifikation 2. Runde',
    header: 'Qualifikation #2',
  }),
  '3rd Qualifying Round': () => ({
    default: 'Qualifikation 3. Runde',
    header: 'Qualifikation #3',
  }),
  League: (round) => ({
    default: leagueLabel(round),
    header: `${roundNumber(round)}. Spieltag`,
  }),
  'Preliminary Round': () => ({
    default: 'Vorrunde',
    header: 'Vorrunde',
  }),
  'Play-offs': () => ({
    default: 'Ausscheidungsspiele',
    header: 'Ausscheidungsspiele',
  }),
  'Round of 16': () => ({
    default: 'Achtelfinale',
    header: 'Achtelfinale',
  }),
  'Quarter-finals': () => ({
    default: 'Viertelfinale',
    header: 'Viertelfinale',
  }),
  'Semi-finals': () => ({
    default: 'Halbfinale',
    header: 'Halbfinale',
  }),
  Final: () => ({
    default: 'Finale',
    header: 'Finale',
  }),
};

const translationCache: Record<
  string,
  Record<LabelType, Record<CompetitionRoundType, CompetitionRound>>
> = {};

const getTranslations = (
  labelType: LabelType,
  round: CompetitionRound
): Record<CompetitionRoundType, CompetitionRound> => {
  if (!translationCache[round]) {
    translationCache[round] = {
      default: Object.fromEntries(
        Object.entries(COMPETITION_ROUND_MAP).map(([key, value]) => [
          key,
          value(round).default,
        ])
      ),
      header: Object.fromEntries(
        Object.entries(COMPETITION_ROUND_MAP).map(([key, value]) => [
          key,
          value(round).header,
        ])
      ),
    };
  }
  return translationCache[round][labelType];
};

export const DEFAULT_TRANSLATIONS = (round: CompetitionRound) =>
  getTranslations('default', round);
export const HEADER_TRANSLATIONS = (round: CompetitionRound) =>
  getTranslations('header', round);

export const ROUND_LABEL_TYPES: CompetitionRoundType[] = Object.keys(
  COMPETITION_ROUND_MAP
) as CompetitionRoundType[];
