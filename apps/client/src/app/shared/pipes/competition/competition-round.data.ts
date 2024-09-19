import { CompetitionRound } from '@lib/models';
import { LabelType } from './label.model';

type CompetitionRoundType = string;

const ROUND_LABEL_TYPES: Array<CompetitionRoundType> = [
  'Regular Season',
  'League Stage', // UEFA Champions league group stage
  'League', // UEFA Nations League group stage
  '1st Round',
  '2nd Round',
  '3rd Round',
  '1st Qualifying Round',
  '2nd Qualifying Round',
  '3rd Qualifying Round',
  'Preliminary Round',
  'Play-offs',
  'Round of 16',
  'Quarter-finals',
  'Semi-finals',
  'Final',
];

export const translatedCompetitionRound = (
  value: CompetitionRound,
  labelType: LabelType
): CompetitionRound => {
  const type = getType(value);

  switch (labelType) {
    case 'default':
      return translateDefault(type, value);
    case 'header':
      return translateHeader(type, value);
    default:
      return translateDefault(type, value);
  }
};

const getType = (value: CompetitionRound): CompetitionRoundType => {
  const type = ROUND_LABEL_TYPES.find((t) => value.includes(t));
  return type ?? '';
};

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

const translateDefault = (
  type: CompetitionRoundType,
  value: CompetitionRound
): CompetitionRound => {
  switch (type) {
    case 'Regular Season':
    case 'League Stage':
      return `${roundNumber(value)}. Spieltag`;
    case '1st Round':
      return '1. Runde';
    case '2nd Round':
      return '2. Runde';
    case '3rd Round':
      return '3. Runde';
    case '1st Qualifying Round':
      return 'Qualifikation 1. Runde';
    case '2nd Qualifying Round':
      return 'Qualifikation 2. Runde';
    case '3rd Qualifying Round':
      return 'Qualifikation 3. Runde';
    case 'League':
      return leagueLabel(value);
    case 'Preliminary Round':
      return 'Vorrunde';
    case 'Play-offs':
      return 'Ausscheidungsspiele';
    case 'Round of 16':
      return 'Achtelfinale';
    case 'Quarter-finals':
      return 'Viertelfinale';
    case 'Semi-finals':
      return 'Halbfinale';
    case 'Final':
      return 'Finale';
    default:
      return value;
  }
};

const translateHeader = (
  type: CompetitionRoundType,
  value: CompetitionRound
): CompetitionRound => {
  switch (type) {
    case 'Regular Season':
    case 'League Stage':
      return `${roundNumber(value)}. Spieltag`;
    case '1st Round':
      return '1. Runde';
    case '2nd Round':
      return '2. Runde';
    case '3rd Round':
      return '3. Runde';
    case '1st Qualifying Round':
      return 'Qualifikation #1';
    case '2nd Qualifying Round':
      return 'Qualifikation #2';
    case '3rd Qualifying Round':
      return 'Qualifikation #3';
    case 'League':
      return `${roundNumber(value)}. Spieltag`;
    case 'Preliminary Round':
      return 'Vorrunde';
    case 'Play-offs':
      return 'Ausscheidungsspiele';
    case 'Round of 16':
      return 'Achtelfinale';
    case 'Quarter-finals':
      return 'Viertelfinale';
    case 'Semi-finals':
      return 'Halbfinale';
    case 'Final':
      return 'Finale';
    default:
      return value;
  }
};
