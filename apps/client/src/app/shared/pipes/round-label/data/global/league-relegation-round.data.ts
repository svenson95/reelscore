import type { RoundMapOverride } from '../../round-label.helper';

export const LEAGUE_RELEGATION_ROUND_MAP = {
  Final: () => ({
    default: 'Relegation',
    header: 'Relegation',
  }),
} satisfies RoundMapOverride;
