import { type RoundMapOverride, roundNumber } from '../../round-label.helper';

export const CHAMPIONS_LEAGUE_FROM_2025_ROUND_MAP = {
  'League Stage': (round) => ({
    default: `${roundNumber(round)}. Spieltag`,
    header: `${roundNumber(round)}. Spieltag`,
  }),

  'Knockout Round Play-offs': () => ({
    default: 'Play-offs der K.-o.-Runde',
    header: 'Play-offs',
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
} satisfies RoundMapOverride;
