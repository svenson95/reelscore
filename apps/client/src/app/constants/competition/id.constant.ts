import { Competition } from './competition.constant';

export const COMPETITION_ID = {
  [Competition.ENGLAND_PREMIER_LEAGUE]: '39',
  [Competition.GERMANY_BUNDESLIGA]: '78',
  [Competition.GERMANY_BUNDESLIGA_2]: '79',
  [Competition.ITALY_SERIE_A]: '135',
  [Competition.SPAIN_LA_LIGA]: '140',
  [Competition.FRANCE_LIGUE_1]: '61',

  [Competition.ENGLAND_LEAGUE_CUP]: '48',
  [Competition.ENGLAND_EFL_TROPHY]: '46',
  [Competition.ENGLAND_FA_TROPHY]: '47',
  [Competition.ENGLAND_FA_CUP]: '45',
  [Competition.ENGLAND_COMMUNITY_SHIELD]: '528',
  [Competition.ENGLAND_PREMIER_LEAGUE_CUP]: '871',
  [Competition.GERMANY_SUPER_CUP]: '529',
  [Competition.GERMANY_DFB_POKAL]: '81',
  [Competition.ITALY_SUPER_CUP]: '547',
  [Competition.ITALY_COPPA_ITALIA]: '137',
  [Competition.SPAIN_SUPER_CUP]: '556',
  [Competition.SPAIN_COPA_DEL_REY]: '143',
  [Competition.FRANCE_COUPE_DE_LA_LIGUE]: '65',
  [Competition.FRANCE_COUPE_DE_FRANCE]: '66',
  [Competition.FRANCE_TROPHEE_DES_CHAMPIONS]: '526',

  [Competition.INTERNATIONAL_UEFA_CHAMPIONS_LEAGUE]: '2',
  [Competition.INTERNATIONAL_UEFA_EURO_LEAGUE]: '3',
  [Competition.INTERNATIONAL_UEFA_SUPER_CUP]: '531',
};

export type LeagueId = string;
