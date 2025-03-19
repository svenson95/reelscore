import { CompetitionMatchDays } from '@lib/models';

export const replaceWhitespaces = (str: string): string => {
  return str.replace(/\s/g, '%20');
};

const REGULAR_SEASON_STR = 'Regular Season - ';
const SMALL_LEAGUE_ROUND_STRINGS = {
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
const BIG_LEAGUE_ROUND_STRINGS = {
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
  35: `${REGULAR_SEASON_STR}35`,
  36: `${REGULAR_SEASON_STR}36`,
  37: `${REGULAR_SEASON_STR}37`,
  38: `${REGULAR_SEASON_STR}38`,
};

const QUALIFY_STR = 'Qualifying Round';
const QUALIFY_ROUNDS = {
  1: `1st ${QUALIFY_STR}`,
  2: `2nd ${QUALIFY_STR}`,
  3: `3rd ${QUALIFY_STR}`,
};
const EU_CL_GROUP_STAGE_STR = 'League Stage - ';
const EU_CL_ROUNDS = {
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
const GROUP_STAGE_STR = 'Group Stage - ';
const EU_EL_ROUNDS = {
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
  13: 'Knockout Round Play-offs',
  14: 'Round of 16',
  15: 'Quarter-finals',
  16: 'Semi-finals',
  17: 'Final',
};
const EU_UEFA_SUPER_CUP = {
  1: 'Final',
};

// Deutschland
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

// England
const EN_LEAGUE_CUP = {
  1: '1st Round',
  2: '2nd Round',
  3: '3rd Round',
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
const EN_FA_TROPHY_QUALIFY_ROUND = ' Round Qualifying';
const EN_FA_TROPHY_ROUND = ' Round';
const EN_FA_TROPHY = {
  1: `1st${EN_FA_TROPHY_QUALIFY_ROUND}`,
  2: `2nd${EN_FA_TROPHY_QUALIFY_ROUND}`,
  3: `3rd${EN_FA_TROPHY_QUALIFY_ROUND}`,
  4: `1st${EN_FA_TROPHY_ROUND}`,
  5: `2nd${EN_FA_TROPHY_ROUND}`,
  6: `3rd${EN_FA_TROPHY_ROUND}`,
  7: `4th${EN_FA_TROPHY_ROUND}`,
  8: `5th${EN_FA_TROPHY_ROUND}`,
  9: 'Quarter-finals',
  10: 'Semi-finals',
  11: 'Final',
};
const EN_FA_CUP = {
  1: 'Extra Preliminary Round',
  2: 'Extra Preliminary Round Replays',
  3: 'Preliminary Round',
  4: 'Preliminary Round Replays',
  5: '1st Round Qualifying',
  6: '1st Round Qualifying Replays',
  7: '2nd Round Qualifying',
  8: '2nd Round Qualifying Replays',
  9: '3rd Round Qualifying',
  10: '3rd Round Qualifying Replays',
  11: '4th Round Qualifying',
  12: '4th Round Qualifying Replays',
  13: '1st Round',
  14: '2nd Round',
  15: '3rd Round',
  16: '4th Round',
  17: '5th Round',
  18: 'Quarter-finals',
  19: 'Semi-finals',
  20: 'Final',
};
const EN_COMMUNITY_SHIELD = { 1: 'Final' };
const EN_PREMIER_LEAGUE_CUP = {
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
  11: 'Round of 16',
  12: 'Quarter-finals',
  13: 'Semi-finals',
  14: 'Final',
};

// Spanien
const ES_SUPER_CUP = {
  1: 'Semi-finals',
  2: 'Final',
};
const ES_COPA_DEL_REY = {
  1: 'Preliminary Round',
  2: '1st Round',
  3: '2nd Round',
  4: 'Round of 32',
  5: 'Round of 16',
  6: 'Quarter-finals',
  7: 'Semi-finals',
  8: 'Final',
};

// Italien
const IT_SUPER_CUP = {
  1: 'Semi-finals',
  2: 'Final',
};
const IT_COPPA_ITALIA = {
  0: 'Preliminary Round',
  1: '1st Round',
  2: '2nd Round',
  3: 'Round of 16',
  4: 'Quarter-finals',
  5: 'Semi-finals',
  6: 'Final',
};

// Frankreich
const FR_COUPE_DE_FRANCE = {
  1: '7th Round',
  2: '8th Round',
  3: 'Round of 64',
  4: 'Round of 32',
  5: 'Round of 16',
  6: 'Quarter-finals',
  7: 'Semi-finals',
  8: 'Final',
};
const FR_TROPHEE_DES_CHAMPIONS = {
  1: 'Final',
};

const INTERNATIONAL_WORLD_CUP = {
  1: 'Group Stage - 1',
  2: 'Group Stage - 2',
  3: 'Group Stage - 3',
  4: 'Round of 16',
  5: 'Quarter-finals',
  6: 'Semi-finals',
  7: '3rd Place Final',
  8: 'Final',
};

const INTERNATIONAL_EURO_CHAMPIONSHIP = {
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

const INTERNATIONAL_UEFA_NATIONS_LEAGUE = {
  1: 'League A - 1',
  2: 'League B - 1',
  3: 'League C - 1',
  4: 'League D - 1',
  5: 'League A - 2',
  6: 'League B - 2',
  7: 'League C - 2',
  8: 'League D - 2',
  9: 'League A - 3',
  10: 'League B - 3',
  11: 'League C - 3',
  12: 'League D - 3',
  13: 'League A - 4',
  14: 'League B - 4',
  15: 'League C - 4',
  16: 'League D - 4',
  17: 'League A - 5',
  18: 'League B - 5',
  19: 'League C - 5',
  20: 'League D - 5',
  21: 'League A - 6',
  22: 'League B - 6',
  23: 'League C - 6',
  24: 'League D - 6',
  25: 'Play-offs A/B',
  26: 'Play-offs B/C',
  27: 'Quarter-finals',
  28: 'Play-offs C/D',
};

const INTERNATIONAL_WORLD_CUP_QUALIFICATION_CONCACAF = {
  1: '1st Round - 1',
  2: '1st Round - 2',
  3: '1st Round - 3',
  4: '1st Round - 4',
  5: '1st Round - 5',
  6: '2nd Round',
  7: 'Final Round - 1',
  8: 'Final Round - 2',
  9: 'Final Round - 3',
  10: 'Final Round - 4',
  11: 'Final Round - 5',
  12: 'Final Round - 6',
  13: 'Final Round - 7',
  14: 'Final Round - 8',
  15: 'Final Round - 9',
  16: 'Final Round - 10',
  17: 'Final Round - 11',
  18: 'Final Round - 12',
  19: 'Final Round - 13',
  20: 'Final Round - 14',
};

const INTERNATIONAL_WORLD_CUP_QUALIFICATION_EUROPE = {
  1: 'Group Stage - 1',
  2: 'Group Stage - 2',
  3: 'Group Stage - 3',
  4: 'Group Stage - 4',
  5: 'Group Stage - 5',
  6: 'Group Stage - 6',
  7: 'Group Stage - 7',
  8: 'Group Stage - 8',
  9: 'Group Stage - 9',
  10: 'Group Stage - 10',
};

export const COMPETITION_ROUNDS: CompetitionMatchDays = {
  // Europa
  531: EU_UEFA_SUPER_CUP,
  2: EU_CL_ROUNDS,
  3: EU_EL_ROUNDS,

  // International
  1: INTERNATIONAL_WORLD_CUP,
  4: INTERNATIONAL_EURO_CHAMPIONSHIP,
  // 21: INTERNATIONAL_CONFEDERATIONS_CUP,
  // 15: INTERNATIONAL_FIFA_WORLD_CUP,
  5: INTERNATIONAL_UEFA_NATIONS_LEAGUE,
  31: INTERNATIONAL_WORLD_CUP_QUALIFICATION_CONCACAF,
  32: INTERNATIONAL_WORLD_CUP_QUALIFICATION_EUROPE,

  // Deutschland
  78: SMALL_LEAGUE_ROUND_STRINGS,
  79: SMALL_LEAGUE_ROUND_STRINGS,
  529: DE_SUPER_CUP,
  81: DE_DFB_POKAL,

  // England
  39: BIG_LEAGUE_ROUND_STRINGS,
  45: EN_FA_CUP,
  46: EN_EFL_TROPHY,
  47: EN_FA_TROPHY,
  48: EN_LEAGUE_CUP,
  528: EN_COMMUNITY_SHIELD,
  871: EN_PREMIER_LEAGUE_CUP,

  // Spanien
  140: BIG_LEAGUE_ROUND_STRINGS,
  556: ES_SUPER_CUP,
  143: ES_COPA_DEL_REY,

  // Italien
  135: BIG_LEAGUE_ROUND_STRINGS,
  547: IT_SUPER_CUP,
  137: IT_COPPA_ITALIA,

  // Frankreich
  61: SMALL_LEAGUE_ROUND_STRINGS,
  // 65: FR_COUPE_DE_LA_LIGUE,
  66: FR_COUPE_DE_FRANCE,
  526: FR_TROPHEE_DES_CHAMPIONS,

  // Niederlande
  88: SMALL_LEAGUE_ROUND_STRINGS,
};
