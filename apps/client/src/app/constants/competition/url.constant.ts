import { CompetitionUrl } from '@lib/models';
import { CompetitionCode } from './code.constant';

export const COMPETITION_URL: Record<CompetitionCode, CompetitionUrl> = {
  // Europa
  [CompetitionCode.EUROPA_UEFA_CHAMPIONS_LEAGUE]: '2',
  [CompetitionCode.EUROPA_UEFA_EURO_LEAGUE]: '3',
  [CompetitionCode.EUROPA_UEFA_SUPER_CUP]: '531',

  // International

  // Deutschland
  [CompetitionCode.GERMANY_BUNDESLIGA]: 'bundesliga',
  [CompetitionCode.GERMANY_BUNDESLIGA_2]: 'bundesliga-2',
  [CompetitionCode.GERMANY_SUPER_CUP]: '529',
  [CompetitionCode.GERMANY_DFB_POKAL]: '81',

  // England
  [CompetitionCode.ENGLAND_PREMIER_LEAGUE]: 'premier-league',
  [CompetitionCode.ENGLAND_LEAGUE_CUP]: '48',
  [CompetitionCode.ENGLAND_EFL_TROPHY]: '46',
  [CompetitionCode.ENGLAND_FA_TROPHY]: '47',
  [CompetitionCode.ENGLAND_FA_CUP]: '45',
  [CompetitionCode.ENGLAND_COMMUNITY_SHIELD]: '528',
  [CompetitionCode.ENGLAND_PREMIER_LEAGUE_CUP]: '871',

  // Spanien
  [CompetitionCode.SPAIN_LA_LIGA]: 'la-liga',
  [CompetitionCode.SPAIN_SUPER_CUP]: '556',
  [CompetitionCode.SPAIN_COPA_DEL_REY]: '143',

  // Italien
  [CompetitionCode.ITALY_SERIE_A]: 'serie-a',
  [CompetitionCode.ITALY_SUPER_CUP]: '547',
  [CompetitionCode.ITALY_COPPA_ITALIA]: '137',

  // Frankreich
  [CompetitionCode.FRANCE_LIGUE_1]: 'ligue-1',
  // [CompetitionCode.FRANCE_COUPE_DE_LA_LIGUE]: '65',
  [CompetitionCode.FRANCE_COUPE_DE_FRANCE]: '66',
  [CompetitionCode.FRANCE_TROPHEE_DES_CHAMPIONS]: '526',
};
