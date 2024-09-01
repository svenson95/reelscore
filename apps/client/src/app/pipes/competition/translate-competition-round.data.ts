import { CompetitionRound } from '@lib/models';
import { CompetitionRoundLabel, LabelType } from './label.model';

type CompetitionRoundType = string;

const ROUND_LABEL_TYPES = [
  'Regular Season',
  'League', // UEFA Nations League group stage
  '1st Round',
  '2nd Round',
  '3rd Round',
  '1st Qualifying Round',
  '2nd Qualifying Round',
  '3rd Qualifying Round',
  'Play-offs',
];

export const translatedCompetitionRound = (
  value: CompetitionRound,
  labelType: LabelType
): CompetitionRoundLabel => {
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

const roundString = (round: CompetitionRound): CompetitionRoundLabel => {
  const idx = round.lastIndexOf('-') + 2;
  return round.slice(idx, round.length);
};

const translateDefault = (
  type: CompetitionRoundType,
  value: CompetitionRound
): CompetitionRoundLabel => {
  switch (type) {
    case 'Regular Season':
      return roundString(value);
    case '1st Round':
      return '1. Runde';
    case '2nd Round':
      return '2. Runde';
    case '3rd Round':
      return '3. Runde';
    case '1st Qualifying Round':
      return '1. Qualifikationsrunde';
    case '2nd Qualifying Round':
      return '2. Qualifikationsrunde';
    case '3rd Qualifying Round':
      return '3. Qualifikationsrunde';
    case 'Play-offs':
      return 'Ausscheidungsspiele';
    default:
      return value;
  }
};

const translateHeader = (
  type: CompetitionRoundType,
  value: CompetitionRound
): CompetitionRoundLabel => {
  switch (type) {
    case 'Regular Season':
      return `${roundString(value)}. Spieltag`;
    case 'League':
      return '';
    case '1st Round':
      return '1. Runde';
    case '2nd Round':
      return '2. Runde';
    case '3rd Round':
      return '3. Runde';
    case '1st Qualifying Round':
      return '1. Runde';
    case '2nd Qualifying Round':
      return '2. Runde';
    case '3rd Qualifying Round':
      return '3. Runde';
    case 'Play-offs':
      return 'Ausscheidungsspiele';
    default:
      return value;
  }
};
