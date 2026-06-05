import { type RoundMapOverride } from '../../round-label.helper';

export const FRIENDLIES_FROM_2023_ROUND_MAP = {
  Friendlies: (round) => ({
    default: '-',
    header: '-',
  }),

  'Friendlies 1': () => ({
    default: '-',
    header: '-',
  }),

  'Friendlies 2': () => ({
    default: '-',
    header: '-',
  }),

  'Friendlies 3': () => ({
    default: '-',
    header: '-',
  }),

  'World: Friendly International': () => ({
    default: '-',
    header: '-',
  }),

  'Friendly International': () => ({
    default: '-',
    header: '-',
  }),
} satisfies RoundMapOverride;
