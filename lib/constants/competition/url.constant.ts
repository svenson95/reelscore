import { CompetitionUrl } from '../../models';
import { CompetitionCode } from './code.constant';

export const COMPETITION_URL: Record<CompetitionCode, CompetitionUrl> = {
  // Europa
  [CompetitionCode.EUROPA_UEFA_CHAMPIONS_LEAGUE]: 'champions-league',
  [CompetitionCode.EUROPA_UEFA_EURO_LEAGUE]: 'euro-league',
  [CompetitionCode.EUROPA_UEFA_SUPER_CUP]: 'uefa-super-cup',

  // International

  // Deutschland
  [CompetitionCode.GERMANY_BUNDESLIGA]: 'bundesliga',
  [CompetitionCode.GERMANY_BUNDESLIGA_2]: 'bundesliga-2',
  [CompetitionCode.GERMANY_SUPER_CUP]: 'de-super-cup',
  [CompetitionCode.GERMANY_DFB_POKAL]: 'dfb-pokal',

  // England
  [CompetitionCode.ENGLAND_PREMIER_LEAGUE]: 'premier-league',
  [CompetitionCode.ENGLAND_LEAGUE_CUP]: 'en-league-cup',
  [CompetitionCode.ENGLAND_EFL_TROPHY]: 'efl-trophy',
  [CompetitionCode.ENGLAND_FA_TROPHY]: 'fa-trophy',
  [CompetitionCode.ENGLAND_FA_CUP]: 'fa-cup',
  [CompetitionCode.ENGLAND_COMMUNITY_SHIELD]: 'community-shield',
  [CompetitionCode.ENGLAND_PREMIER_LEAGUE_CUP]: 'premier-league-cup',

  // Spanien
  [CompetitionCode.SPAIN_LA_LIGA]: 'la-liga',
  [CompetitionCode.SPAIN_SUPER_CUP]: 'es-super-cup',
  [CompetitionCode.SPAIN_COPA_DEL_REY]: 'copa-del-rey',

  // Italien
  [CompetitionCode.ITALY_SERIE_A]: 'serie-a',
  [CompetitionCode.ITALY_SUPER_CUP]: 'it-super-cup',
  [CompetitionCode.ITALY_COPPA_ITALIA]: 'coppa-italia',

  // Frankreich
  [CompetitionCode.FRANCE_LIGUE_1]: 'ligue-1',
  // [CompetitionCode.FRANCE_COUPE_DE_LA_LIGUE]: '65',
  [CompetitionCode.FRANCE_COUPE_DE_FRANCE]: 'coupe-de-france',
  [CompetitionCode.FRANCE_TROPHEE_DES_CHAMPIONS]: 'trophee-des-champions',
};
