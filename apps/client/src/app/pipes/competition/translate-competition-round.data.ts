import { CompetitionRound } from '@lib/models';
import { CompetitionRoundLabel, LabelType } from './label.model';

type CompetitionRoundType = string;

const ROUND_LABEL_TYPES = [
  'Regular Season',
  'League', // UEFA Nations League group stage
  'League Stage', // UEFA CHampions league group stage
  '1st Round',
  '2nd Round',
  '3rd Round',
  '1st Qualifying Round',
  '2nd Qualifying Round',
  '3rd Qualifying Round',
  'Preliminary Round',
  'Play-offs',
  'Final',
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

const groupstageLabel = (value: CompetitionRound): CompetitionRoundLabel => {
  const roundIdx = value.indexOf('-') + 2;
  const round = value.slice(roundIdx, value.length);
  return `Gruppenphase #${round}`;
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
      return 'Qualifikation 1. Runde';
    case '2nd Qualifying Round':
      return 'Qualifikation 2. Runde';
    case '3rd Qualifying Round':
      return 'Qualifikation 3. Runde';
    case 'League':
      return groupstageLabel(value);
    case 'Preliminary Round':
      return 'Vorrunde';
    case 'Play-offs':
      return 'Ausscheidungsspiele';
    case 'Final':
      return 'Finale';
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
      return groupstageLabel(value);
    case 'Preliminary Round':
      return 'Vorrunde';
    case 'Play-offs':
      return 'Ausscheidungsspiele';
    case 'Final':
      return 'Finale';
    default:
      return value;
  }
};
