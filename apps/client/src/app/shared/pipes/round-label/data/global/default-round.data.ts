import type { RoundMapOverride } from '../../round-label.helper';
import {
  groupLabel,
  groupLabelHeader,
  leagueLabel,
  roundNumber,
} from '../../round-label.helper';

export const DEFAULT_ROUND_MAP = {
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

  Group: (round) => ({
    default: groupLabel(round),
    header: groupLabelHeader(round),
  }),

  League: (round) => ({
    default: leagueLabel(round),
    header: `${roundNumber(round)}. Spieltag`,
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

  'Preliminary Round': () => ({
    default: 'Vorrunde',
    header: 'Vorrunde',
  }),

  'Play-offs': () => ({
    default: 'Ausscheidungsspiele',
    header: 'Ausscheidungsspiele',
  }),

  'Round of 32': () => ({
    default: 'Sechzehntelfinale',
    header: 'Sechzehntelfinale',
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

  'Friendly International': () => ({
    default: '',
    header: '',
  }),
} satisfies RoundMapOverride;
