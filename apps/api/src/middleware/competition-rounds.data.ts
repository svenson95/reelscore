import { CompetitionRoundsData } from '@lib/models';

export const replaceWhitespaces = (str: string): string => {
  return str.replace(/\s/g, '%20');
};

const REGULAR_SEASON_STR = 'Regular Season - ';
const GROUP_STAGE_STR = 'Group Stage - ';
const EU_CL_GROUP_STAGE_STR = 'League Stage - ';
const QUALIFY_STR = 'Qualifying Round';
const QUALIFY_ROUNDS = {
  1: `1st ${QUALIFY_STR}`,
  2: `2nd ${QUALIFY_STR}`,
  3: `3rd ${QUALIFY_STR}`,
};
const EN_FA_TROPHY_QUALIFY_ROUND = ' Round Qualifying';
const EN_FA_TROPHY_ROUND = ' Round';

const SMALL_LEAGUE = {
  1: `${REGULAR_SEASON_STR}1`,
  2: `${REGULAR_SEASON_STR}2`,
  3: `${REGULAR_SEASON_STR}3`,
  4: `${REGULAR_SEASON_STR}4`,
  5: `${REGULAR_SEASON_STR}5`,
  6: `${REGULAR_SEASON_STR}6`,
  7: `${REGULAR_SEASON_STR}7`,
  8: `${REGULAR_SEASON_STR}8`,
  9: `${REGULAR_SEASON_STR}9`,
  10: `${REGULAR_SEASON_STR}10`,
  11: `${REGULAR_SEASON_STR}11`,
  12: `${REGULAR_SEASON_STR}12`,
  13: `${REGULAR_SEASON_STR}13`,
  14: `${REGULAR_SEASON_STR}14`,
  15: `${REGULAR_SEASON_STR}15`,
  16: `${REGULAR_SEASON_STR}16`,
  17: `${REGULAR_SEASON_STR}17`,
  18: `${REGULAR_SEASON_STR}18`,
  19: `${REGULAR_SEASON_STR}19`,
  20: `${REGULAR_SEASON_STR}20`,
  21: `${REGULAR_SEASON_STR}21`,
  22: `${REGULAR_SEASON_STR}22`,
  23: `${REGULAR_SEASON_STR}23`,
  24: `${REGULAR_SEASON_STR}24`,
  25: `${REGULAR_SEASON_STR}25`,
  26: `${REGULAR_SEASON_STR}26`,
  27: `${REGULAR_SEASON_STR}27`,
  28: `${REGULAR_SEASON_STR}28`,
  29: `${REGULAR_SEASON_STR}29`,
  30: `${REGULAR_SEASON_STR}30`,
  31: `${REGULAR_SEASON_STR}31`,
  32: `${REGULAR_SEASON_STR}32`,
  33: `${REGULAR_SEASON_STR}33`,
  34: `${REGULAR_SEASON_STR}34`,
};
const SMALL_LEAGUE_2023 = {
  ...SMALL_LEAGUE,
  35: 'Relegation Round',
};

const BIG_LEAGUE = {
  ...SMALL_LEAGUE,
  35: `${REGULAR_SEASON_STR}35`,
  36: `${REGULAR_SEASON_STR}36`,
  37: `${REGULAR_SEASON_STR}37`,
  38: `${REGULAR_SEASON_STR}38`,
};

/* GERMANY */

const BUNDESLIGA_2025 = {
  ...SMALL_LEAGUE,
  35: 'Final',
};

const DE_SUPER_CUP = {
  1: 'Final',
};
const DE_DFB_POKAL = {
  1: '1st Round',
  2: '2nd Round',
  3: 'Round of 16',
  4: 'Quarter-finals',
  5: 'Semi-finals',
  6: 'Final',
};

/* SPAIN */

const LA_LIGA_2025 = {
  ...BIG_LEAGUE,
  3: 'Regular Season - 6',
  4: 'Regular Season - 3',
  5: 'Regular Season - 4',
  6: 'Regular Season - 5',
  15: 'Regular Season - 19',
  16: 'Regular Season - 15',
  17: 'Regular Season - 16',
  18: 'Regular Season - 17',
  19: 'Regular Season - 18',
  32: 'Regular Season - 33',
  33: 'Regular Season - 32',
};
const LA_LIGA_2023 = {
  ...BIG_LEAGUE,
};

const ES_SUPER_CUP = {
  1: 'Semi-finals',
  2: 'Final',
};

const ES_COPA_DEL_REY_2025 = {
  1: '1/128-finals',
  2: 'Round of 128',
  3: 'Round of 64',
  4: 'Round of 32',
  5: 'Round of 16',
  6: 'Quarter-finals',
  7: 'Semi-finals',
  8: 'Final',
};
const ES_COPA_DEL_REY_2023 = {
  ...ES_COPA_DEL_REY_2025,
  1: 'Preliminary Round',
  2: '1st Round',
  3: '2nd Round',
};

/* England */

const EN_LEAGUE_CUP = {
  1: '1st Round',
  2: '2nd Round',
  3: '3rd Round',
  4: '4th Round',
  5: 'Quarter-finals',
  6: 'Semi-finals',
  7: 'Final',
};
const EN_LEAGUE_CUP_2023 = {
  ...EN_LEAGUE_CUP,
  4: 'Round of 16',
  5: 'Quarter-finals',
  6: 'Semi-finals',
  7: 'Final',
};

const EN_EFL_TROPHY = {
  1: `${GROUP_STAGE_STR}1`,
  2: `${GROUP_STAGE_STR}2`,
  3: `${GROUP_STAGE_STR}3`,
  4: `${GROUP_STAGE_STR}4`,
  5: `${GROUP_STAGE_STR}5`,
  6: `${GROUP_STAGE_STR}6`,
  7: `${GROUP_STAGE_STR}7`,
  8: `${GROUP_STAGE_STR}8`,
  9: `${GROUP_STAGE_STR}9`,
  10: `${GROUP_STAGE_STR}10`,
  11: '2nd Round',
  12: '3rd Round',
  13: 'Quarter-finals',
  14: 'Semi-finals',
  15: 'Final',
};

const EN_FA_TROPHY_2025 = {
  1: `1st${EN_FA_TROPHY_QUALIFY_ROUND}`,
  2: `2nd${EN_FA_TROPHY_QUALIFY_ROUND}`,
  3: `3rd${EN_FA_TROPHY_QUALIFY_ROUND}`,
  4: '1/128-finals',
  5: 'Round of 128',
  6: 'Round of 64',
  7: 'Round of 32',
  8: 'Round of 16',
  9: 'Quarter-finals',
  10: 'Semi-finals',
  11: 'Final',
};
const EN_FA_TROPHY_2023 = {
  ...EN_FA_TROPHY_2025,
  4: `1st${EN_FA_TROPHY_ROUND}`,
  5: `2nd${EN_FA_TROPHY_ROUND}`,
  6: `3rd${EN_FA_TROPHY_ROUND}`,
  7: `4th${EN_FA_TROPHY_ROUND}`,
  8: `5th${EN_FA_TROPHY_ROUND}`,
  9: 'Quarter-finals',
  10: 'Semi-finals',
  11: 'Final',
};

const EN_FA_CUP_BASE = {
  1: '1st Round Qualifying',
  2: '1st Round Qualifying Replays',
  3: '2nd Round Qualifying',
  4: '2nd Round Qualifying Replays',
  5: '3rd Round Qualifying',
  6: '3rd Round Qualifying Replays',
  7: '4th Round Qualifying',
  8: '4th Round Qualifying Replays',
};
const EN_FA_CUP_2025 = {
  ...EN_FA_CUP_BASE,
  6: '1/128-finals',
  7: 'Round of 128',
  8: 'Round of 64',
  9: 'Round of 32',
  10: 'Round of 16',
  11: 'Quarter-finals',
  12: 'Semi-finals',
  13: 'Final',
};
const EN_FA_CUP_2024 = {
  ...EN_FA_CUP_BASE,
  9: '1st Round',
  10: '2nd Round',
  11: '3rd Round',
  13: '4th Round',
  14: '5th Round',
  15: 'Quarter-finals',
  16: 'Semi-finals',
  17: 'Final',
};
const EN_FA_CUP_2023 = {
  ...EN_FA_CUP_BASE,
  9: '1st Round',
  10: '1st Round Replays',
  11: '2nd Round',
  12: '2nd Round Replays',
  13: '3rd Round',
  14: '3rd Round Replays',
  15: '4th Round',
  16: '4th Round Replays',
  17: '5th Round',
  18: 'Quarter-finals',
  19: 'Semi-finals',
  20: 'Final',
};

const EN_COMMUNITY_SHIELD = { 1: 'Final' };

const EN_PREMIER_LEAGUE_CUP_BASE = {
  1: `${GROUP_STAGE_STR}1`,
  2: `${GROUP_STAGE_STR}2`,
  3: `${GROUP_STAGE_STR}3`,
  4: `${GROUP_STAGE_STR}4`,
  5: `${GROUP_STAGE_STR}5`,
  6: `${GROUP_STAGE_STR}6`,
  7: `${GROUP_STAGE_STR}7`,
  8: `${GROUP_STAGE_STR}8`,
  9: `${GROUP_STAGE_STR}9`,
  10: `${GROUP_STAGE_STR}10`,
};
const EN_PREMIER_LEAGUE_CUP_2025 = {
  1: `${GROUP_STAGE_STR}1`,
  2: `${GROUP_STAGE_STR}3`,
  3: `${GROUP_STAGE_STR}2`,
  4: `${GROUP_STAGE_STR}5`,
  5: `${GROUP_STAGE_STR}6`,
  6: `${GROUP_STAGE_STR}4`,
  7: 'Round of 16',
  8: 'Quarter-finals',
  9: 'Semi-finals',
  10: 'Final',
};
const EN_PREMIER_LEAGUE_CUP_2024 = {
  ...EN_PREMIER_LEAGUE_CUP_BASE,
  11: 'Group Stage - 11',
  12: 'Round of 16',
  13: 'Quarter-finals',
  14: 'Semi-finals',
  15: 'Final',
};
const EN_PREMIER_LEAGUE_CUP_2023 = {
  ...EN_PREMIER_LEAGUE_CUP_BASE,
  11: 'Round of 16',
  12: 'Quarter-finals',
  13: 'Semi-finals',
  14: 'Final',
};

/* ITALY */

const IT_SUPER_CUP = {
  1: 'Semi-finals',
  2: 'Final',
};

const IT_COPPA_ITALIA_2025 = {
  1: 'Preliminary Round',
  2: '1st Round',
  3: '2nd Round',
  4: '3rd Round',
  5: 'Quarter-finals',
  6: 'Semi-finals',
  7: 'Final',
};
const IT_COPPA_ITALIA_2023 = {
  ...IT_COPPA_ITALIA_2025,
  4: 'Round of 16',
};

/* FRANCE */

const LIGUE_1_2025 = {
  ...SMALL_LEAGUE,
  34: 'Relegation round - Quarter-finals',
  35: 'Semi-finals',
  36: `${REGULAR_SEASON_STR}34`,
  37: 'Final',
};

const FR_COUPE_DE_FRANCE_2025 = {
  1: '1/128-finals',
  2: 'Round of 128',
  3: 'Round of 64',
  4: 'Round of 32',
  5: 'Round of 16',
  6: 'Quarter-finals',
  7: 'Semi-finals',
  8: 'Final',
};
const FR_COUPE_DE_FRANCE_2023 = {
  ...FR_COUPE_DE_FRANCE_2025,
  1: '7th Round',
  2: '8th Round',
};

const FR_TROPHEE_DES_CHAMPIONS = {
  1: 'Final',
};

/* NETHERLANDS */

const EREDIVISE_2025 = {
  ...SMALL_LEAGUE,
  35: 'Semi-Finals',
};
const EREDIVISE_2023 = {
  ...SMALL_LEAGUE,
  30: `${REGULAR_SEASON_STR}30`,
  31: `${REGULAR_SEASON_STR}31`,
  32: `${REGULAR_SEASON_STR}32`,
  33: `${REGULAR_SEASON_STR}33`,
  34: 'Relegation Round',
  35: `${REGULAR_SEASON_STR}34`,
  36: 'Conference League Play-offs - Semi-finals',
  37: 'Conference League Play-offs - Final',
};

/* EUROPE */

const EU_CHAMPIONS_LEAGUE_2025 = {
  1: QUALIFY_ROUNDS[1],
  2: QUALIFY_ROUNDS[2],
  3: QUALIFY_ROUNDS[3],
  4: 'Play-offs',
  5: `${EU_CL_GROUP_STAGE_STR}1`,
  6: `${EU_CL_GROUP_STAGE_STR}2`,
  7: `${EU_CL_GROUP_STAGE_STR}3`,
  8: `${EU_CL_GROUP_STAGE_STR}4`,
  9: `${EU_CL_GROUP_STAGE_STR}5`,
  10: `${EU_CL_GROUP_STAGE_STR}6`,
  11: `${EU_CL_GROUP_STAGE_STR}7`,
  12: `${EU_CL_GROUP_STAGE_STR}8`,
  13: 'Round of 16',
  14: 'Quarter-finals',
  15: 'Semi-finals',
  16: 'Final',
};
const EU_CHAMPIONS_LEAGUE_2023 = {
  1: 'Preliminary Round',
  2: '1st Qualifying Round',
  3: '2nd Qualifying Round',
  4: '3rd Qualifying Round',
  5: 'Play-offs',
  6: 'Group F - 1',
  7: 'Group G - 1',
  8: 'Group E - 1',
  9: 'Group H - 1',
  10: 'Group C - 1',
  11: 'Group A - 1',
  12: 'Group B - 1',
  13: 'Group D - 1',
  14: 'Group C - 2',
  15: 'Group D - 2',
  16: 'Group A - 2',
  17: 'Group B - 2',
  18: 'Group E - 2',
  19: 'Group H - 2',
  20: 'Group F - 2',
  21: 'Group G - 2',
  22: 'Group D - 3',
  23: 'Group A - 3',
  24: 'Group B - 3',
  25: 'Group C - 3',
  26: 'Group E - 3',
  27: 'Group H - 3',
  28: 'Group F - 3',
  29: 'Group G - 3',
  30: 'Group F - 4',
  31: 'Group H - 4',
  32: 'Group G - 4',
  33: 'Group E - 4',
  34: 'Group C - 4',
  35: 'Group D - 4',
  36: 'Group B - 4',
  37: 'Group A - 4',
  38: 'Group E - 5',
  39: 'Group H - 5',
  40: 'Group G - 5',
  41: 'Group F - 5',
  42: 'Group B - 5',
  43: 'Group A - 5',
  44: 'Group D - 5',
  45: 'Group C - 5',
  46: 'Group B - 6',
  47: 'Group A - 6',
  48: 'Group C - 6',
  49: 'Group D - 6',
  50: 'Group G - 6',
  51: 'Group F - 6',
  52: 'Group H - 6',
  53: 'Group E - 6',
  54: 'Round of 16',
  55: 'Quarter-finals',
  56: 'Semi-finals',
  57: 'Final',
};

const EU_EUROPA_LEAGUE_2025 = {
  1: QUALIFY_ROUNDS[1],
  2: QUALIFY_ROUNDS[2],
  3: QUALIFY_ROUNDS[3],
  4: 'Play-offs',
  5: `${EU_CL_GROUP_STAGE_STR}1`,
  6: `${EU_CL_GROUP_STAGE_STR}2`,
  7: `${EU_CL_GROUP_STAGE_STR}3`,
  8: `${EU_CL_GROUP_STAGE_STR}4`,
  9: `${EU_CL_GROUP_STAGE_STR}5`,
  10: `${EU_CL_GROUP_STAGE_STR}6`,
  11: `${EU_CL_GROUP_STAGE_STR}7`,
  12: `${EU_CL_GROUP_STAGE_STR}8`,
  13: 'Round of 16',
  14: 'Quarter-finals',
  15: 'Semi-finals',
  16: 'Final',
};
const EU_EUROPA_LEAGUE_2023 = {
  1: '3rd Qualifying Round',
  2: 'Play-offs',
  3: `${GROUP_STAGE_STR}1`,
  4: `${GROUP_STAGE_STR}2`,
  5: `${GROUP_STAGE_STR}3`,
  6: `${GROUP_STAGE_STR}4`,
  7: `${GROUP_STAGE_STR}5`,
  8: `${GROUP_STAGE_STR}6`,
  9: 'Knockout Round Play-offs',
  10: 'Round of 16',
  11: 'Quarter-finals',
  12: 'Semi-finals',
  13: 'Final',
};

const EU_UEFA_SUPER_CUP = {
  1: 'Final',
};

/* INTERNATIONAL */

const INTERNATIONAL_WORLD_CUP_2026 = {
  1: `${GROUP_STAGE_STR}1`,
  2: `${GROUP_STAGE_STR}2`,
  3: `${GROUP_STAGE_STR}3`,
};

const INTERNATIONAL_EURO_CHAMPIONSHIP_2024 = {
  1: 'Group A - 1',
  2: 'Group B - 1',
  3: 'Group D - 1',
  4: 'Group C - 1',
  5: 'Group E - 1',
  6: 'Group F - 1',
  7: 'Group A - 2',
  8: 'Group B - 2',
  9: 'Group D - 2',
  10: 'Group C - 2',
  11: 'Group E - 2',
  12: 'Group F - 2',
  13: 'Group A - 3',
  14: 'Group B - 3',
  15: 'Group D - 3',
  16: 'Group C - 3',
  17: 'Group E - 3',
  18: 'Group F - 3',
  19: 'Round of 16',
  20: 'Quarter-finals',
  21: 'Semi-finals',
  22: 'Final',
};

const INTERNATIONAL_UEFA_NATIONS_LEAGUE_2026 = {
  1: '1',
  2: '2',
  3: '3',
  4: '4',
  5: '5',
  6: '6',
};
const INTERNATIONAL_UEFA_NATIONS_LEAGUE_2024 = {
  1: 'League C - 1',
  2: 'League A - 1',
  3: 'League D - 1',
  4: 'League B - 1',
  5: 'League C - 2',
  6: 'League A - 2',
  7: 'League D - 2',
  8: 'League B - 2',
  9: 'League C - 3',
  10: 'League D - 3',
  11: 'League B - 3',
  12: 'League A - 3',
  13: 'League B - 4',
  14: 'League C - 4',
  15: 'League D - 4',
  16: 'League A - 4',
  17: 'League B - 5',
  18: 'League C - 5',
  19: 'League A - 5',
  20: 'League D - 5',
  21: 'League C - 6',
  22: 'League B - 6',
  23: 'League A - 6',
  24: 'League D - 6',
  25: 'Play-offs A/B',
  26: 'Play-offs B/C',
  27: 'Quarter-finals',
  28: 'Semi-finals',
  29: '3rd Place Final',
  30: 'Final',
  31: 'Play-offs C/D',
};

const INTERNATIONAL_WORLD_CUP_QUALIFICATION_CONCACAF_2026 = {
  1: '1st Round',
  2: '2nd Round - 1',
  3: '2nd Round - 2',
  4: '2nd Round - 3',
  5: '2nd Round - 4',
  6: '2nd Round - 5',
  7: 'Final Round - 1',
  8: 'Final Round - 2',
  9: 'Final Round - 3',
  10: 'Final Round - 4',
  11: 'Final Round - 5',
  12: 'Final Round - 6',
};

const INTERNATIONAL_WORLD_CUP_QUALIFICATION_EUROPE_2024 = {
  1: `${GROUP_STAGE_STR}1`,
  2: `${GROUP_STAGE_STR}2`,
  3: `${GROUP_STAGE_STR}3`,
  4: `${GROUP_STAGE_STR}4`,
  5: `${GROUP_STAGE_STR}5`,
  6: `${GROUP_STAGE_STR}6`,
  7: `${GROUP_STAGE_STR}7`,
  8: `${GROUP_STAGE_STR}8`,
  9: `${GROUP_STAGE_STR}9`,
  10: `${GROUP_STAGE_STR}10`,
  11: 'Semi-finals',
  12: 'Final',
};

const INTERNATIONAL_FRIENDLIES_2026 = {
  1: 'Friendly International',
};
const INTERNATIONAL_FRIENDLIES_2025 = {
  1: 'Friendlies 1',
  2: 'Friendlies 3',
  3: 'Friendlies 2',
  4: 'World: Friendly International',
  5: 'Friendly International',
  6: 'Friendlies',
};
const INTERNATIONAL_FRIENDLIES_2024 = {
  1: 'Friendlies 1',
  2: 'Friendlies 3',
  3: 'Friendlies 2',
  4: 'World: Friendly International',
};
const INTERNATIONAL_FRIENDLIES_2023 = {
  1: 'Friendlies 3',
  2: 'Friendlies 1',
  3: 'Friendlies 2',
};

/* USA */

const MLS_BASE = {
  ...BIG_LEAGUE,
  39: `${REGULAR_SEASON_STR}39`,
  40: `${REGULAR_SEASON_STR}40`,
  41: `${REGULAR_SEASON_STR}41`,
  42: `${REGULAR_SEASON_STR}42`,
  43: `${REGULAR_SEASON_STR}43`,
  44: `${REGULAR_SEASON_STR}44`,
  45: `${REGULAR_SEASON_STR}45`,
  46: `${REGULAR_SEASON_STR}46`,
  47: `${REGULAR_SEASON_STR}47`,
  48: `${REGULAR_SEASON_STR}48`,
  49: `${REGULAR_SEASON_STR}49`,
  50: `${REGULAR_SEASON_STR}50`,
};
const MLS_2026 = {
  ...SMALL_LEAGUE,
  12: 'Regular Season - 13',
  13: 'Regular Season - 14',
  14: 'Regular Season - 15',
  15: 'Regular Season - 16',
  16: 'Regular Season - 17',
  17: 'Regular Season - 18',
  18: 'Regular Season - 19',
  19: 'Regular Season - 20',
  20: 'Regular Season - 21',
  21: 'Regular Season - 22',
  22: 'Regular Season - 23',
  23: 'Regular Season - 24',
  24: 'Regular Season - 25',
  25: 'Regular Season - 26',
  26: 'Regular Season - 27',
  27: 'Regular Season - 28',
  28: 'Regular Season - 29',
  29: 'Regular Season - 30',
  30: 'Regular Season - 31',
  31: 'Regular Season - 32',
  32: 'Regular Season - 33',
  33: 'Regular Season - 34',
  34: 'Regular Season - 35',
  35: 'Regular Season - 36',
  36: 'Regular Season - 12',
  37: 'Regular Season - 37',
};
const MLS_2025 = {
  ...SMALL_LEAGUE,
  35: 'Round of 32',
  36: 'Round of 16',
  37: 'Quarter-finals',
  38: 'Semi-finals',
  39: 'Final',
};
const MLS_2024 = {
  ...MLS_BASE,
  2: 'Regular Season - 3',
  3: 'Regular Season - 2',
  51: 'Regular Season - 51',
  52: 'MLS Cup - Play-In Round',
  53: 'MLS Cup - Round 1',
  54: 'MLS Cup - Conference Semi-finals',
  55: 'MLS Cup - Conference Finals',
  56: 'MLS Cup - Final',
};
const MLS_2023 = {
  ...MLS_BASE,
  51: 'MLS Cup - Play-In Round',
  52: 'MLS Cup - Round 1',
  53: 'MLS Cup - Conference Semi-finals',
  54: 'MLS Cup - Conference Finals',
  55: 'MLS Cup - Final',
};

export const COMPETITION_ROUNDS: CompetitionRoundsData = {
  /* GERMANY */

  // 78: BUNDESLIGA_2025_FIX,
  78: SMALL_LEAGUE_2023,
  // 79: BUNDESLIGA_2025_FIX,
  79: SMALL_LEAGUE_2023,
  529: DE_SUPER_CUP,
  81: DE_DFB_POKAL,

  /* SPAIN */

  // 140: LA_LIGA_2025_FIX,
  140: LA_LIGA_2023,
  556: ES_SUPER_CUP,
  // 143: ES_COPA_DEL_REY_2025,
  143: ES_COPA_DEL_REY_2023,

  /* ENGLAND */

  39: BIG_LEAGUE,
  // 45: EN_FA_CUP,
  45: EN_FA_CUP_2023,
  46: EN_EFL_TROPHY,
  // 47: EN_FA_TROPHY_2025,
  47: EN_FA_TROPHY_2023,
  // 48: EN_LEAGUE_CUP,
  48: EN_LEAGUE_CUP_2023,
  528: EN_COMMUNITY_SHIELD,
  871: EN_PREMIER_LEAGUE_CUP_2023,

  /* ITALY */

  135: BIG_LEAGUE,
  547: IT_SUPER_CUP,
  // 137: IT_COPPA_ITALIA_2025,
  137: IT_COPPA_ITALIA_2023,

  /* FRANCE */

  // 61: LIGUE_1_2025_FIX,
  61: SMALL_LEAGUE_2023,
  // 65: FR_COUPE_DE_LA_LIGUE,
  // 66: FR_COUPE_DE_FRANCE_2025,
  66: FR_COUPE_DE_FRANCE_2023,
  526: FR_TROPHEE_DES_CHAMPIONS,

  /* NETHERLANDS */

  // 88: EREDIVISE_2025_FIX,
  88: EREDIVISE_2023,

  /* EUROPE */

  531: EU_UEFA_SUPER_CUP,
  // 2: EU_CL_ROUNDS,
  2: EU_CHAMPIONS_LEAGUE_2023,
  // 3: EU_EL_ROUNDS,
  3: EU_EUROPA_LEAGUE_2023,

  /* INTERNATIONAL */

  1: INTERNATIONAL_WORLD_CUP_2026,
  4: INTERNATIONAL_EURO_CHAMPIONSHIP_2024,
  // 21: INTERNATIONAL_CONFEDERATIONS_CUP,
  // 15: INTERNATIONAL_FIFA_WORLD_CUP,
  // 5: INTERNATIONAL_UEFA_NATIONS_LEAGUE_2026,
  5: INTERNATIONAL_UEFA_NATIONS_LEAGUE_2024,
  // 10: INTERNATIONAL_FRIENDLIES_2025,
  10: INTERNATIONAL_FRIENDLIES_2023,
  31: INTERNATIONAL_WORLD_CUP_QUALIFICATION_CONCACAF_2026,
  32: INTERNATIONAL_WORLD_CUP_QUALIFICATION_EUROPE_2024,

  /* USA */

  // 253: MLS_LEAGUE_ROUND_STRINGS,
  253: MLS_2023,
};
