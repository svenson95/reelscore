import { CompetitionName } from './competitions';

export const LEAGUES_URLS = {
  [CompetitionName.ENGLAND_PREMIER_LEAGUE]: 'premier-league',
  [CompetitionName.GERMANY_BUNDESLIGA]: 'bundesliga',
  [CompetitionName.GERMANY_BUNDESLIGA_2]: 'bundesliga-2',
  [CompetitionName.ITALY_SERIE_A]: 'seria-a',
  [CompetitionName.SPAIN_LA_LIGA]: 'la-liga',
  [CompetitionName.FRANCE_LIGUE_1]: 'ligue-1',

  // [CompetitionName.ENGLAND_LEAGUE_CUP]: '48',
  // [CompetitionName.ENGLAND_EFL_TROPHY]: '46',
  // [CompetitionName.ENGLAND_FA_TROPHY]: '47',
  // [CompetitionName.ENGLAND_FA_CUP]: '45',
  // [CompetitionName.ENGLAND_COMMUNITY_SHIELD]: '528',
  // [CompetitionName.ENGLAND_PREMIER_LEAGUE_CUP]: '871',
  // [CompetitionName.GERMANY_SUPER_CUP]: '529',
  // [CompetitionName.GERMANY_DFB_POKAL]: '81',
  // [CompetitionName.ITALY_SUPER_CUP]: '547',
  // [CompetitionName.ITALY_COPPA_ITALIA]: '137',
  // [CompetitionName.SPAIN_SUPER_CUP]: '556',
  // [CompetitionName.SPAIN_COPA_DEL_REY]: '143',
  // [CompetitionName.FRANCE_COUPE_DE_LA_LIGUE]: '65',
  // [CompetitionName.FRANCE_COUPE_DE_FRANCE]: '66',
  // [CompetitionName.FRANCE_TROPHEE_DES_CHAMPIONS]: '526',

  // [CompetitionName.INTERNATIONAL_UEFA_CHAMPIONS_LEAGUE]: '2',
  // [CompetitionName.INTERNATIONAL_UEFA_EURO_LEAGUE]: '3',
  // [CompetitionName.INTERNATIONAL_UEFA_SUPER_CUP]: '531',
};

export type LeagueUrl = keyof typeof LEAGUES_URLS;
