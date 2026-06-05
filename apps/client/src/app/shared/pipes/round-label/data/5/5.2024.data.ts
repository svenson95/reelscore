import type { CompetitionRound } from '@lib/models';
import { type RoundMapOverride } from '../../round-label.helper';

const groupLabel = (value: CompetitionRound): CompetitionRound => {
  const spacerIdx = value.indexOf('-');
  const round = value.slice(spacerIdx + 2);
  const group = value.slice(spacerIdx - 2, spacerIdx);

  return `${round}. Spieltag - Gruppe ${group}`;
};

const groupLabelHeader = (value: CompetitionRound): CompetitionRound => {
  const spacerIdx = value.indexOf('-');
  const round = value.slice(spacerIdx + 2);
  const group = value.slice(spacerIdx - 2, spacerIdx);

  return `#${round} Gruppe ${group}`;
};

export const NATIONS_LEAGUE_FROM_2024_ROUND_MAP = {
  League: (round) => ({
    default: groupLabel(round),
    header: groupLabelHeader(round),
  }),

  'Play-offs A/B': () => ({
    default: 'Play-offs A/B',
    header: 'Play-offs A/B',
  }),

  'Play-offs B/C': () => ({
    default: 'Play-offs B/C',
    header: 'Play-offs B/C',
  }),

  'Quarter-finals': () => ({
    default: 'Viertelfinale',
    header: 'Viertelfinale',
  }),

  'Semi-finals': () => ({
    default: 'Halbfinale',
    header: 'Halbfinale',
  }),

  '3rd Place Final': () => ({
    default: 'Spiel um 3. Platz',
    header: '3. Platz',
  }),

  Final: () => ({
    default: 'Finale',
    header: 'Finale',
  }),

  'Play-offs C/D': () => ({
    default: 'Play-offs C/D',
    header: 'Play-offs C/D',
  }),
} satisfies RoundMapOverride;
