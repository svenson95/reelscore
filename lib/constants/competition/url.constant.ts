import { CompetitionUrl } from '../../models';
import { CompetitionCode } from './code.constant';

export const COMPETITION_URL: Record<CompetitionCode, CompetitionUrl> = {
  // Europa
  [CompetitionCode.EUROPA_UEFA_CHAMPIONS_LEAGUE]: 'champions-league',
  [CompetitionCode.EUROPA_UEFA_EURO_LEAGUE]: 'euro-league',
  [CompetitionCode.EUROPA_UEFA_SUPER_CUP]: 'uefa-super-cup',

  // International
  [CompetitionCode.INTERNATIONAL_EURO_CHAMPIONSHIP]: 'euro-championship',
  // [CompetitionCode.INTERNATIONAL_CONFEDARATIONS_CUP]: '21',
  [CompetitionCode.INTERNATIONAL_WORLD_CUP]: 'world-cup',
  [CompetitionCode.INTERNATIONAL_WORLD_CUP_QUALIFICATION_CONCACAF]:
    'world-cup-qualification-concacaf',
  [CompetitionCode.INTERNATIONAL_WORLD_CUP_QUALIFICATION_EUROPE]:
    'world-cup-qualification-europe',
  // [CompetitionCode.INTERNATIONAL_FIFA_WORLD_CUP]: '15',
  [CompetitionCode.INTERNATIONAL_UEFA_NATIONS_LEAGUE]: 'nations-league',

  // Deutschland
  [CompetitionCode.GERMANY_BUNDESLIGA]: 'bundesliga',
  [CompetitionCode.GERMANY_BUNDESLIGA_2]: 'bundesliga-2',
  [CompetitionCode.GERMANY_SUPER_CUP]: 'de-super-cup',
  [CompetitionCode.GERMANY_DFB_POKAL]: 'dfb-pokal',

  // England
  [CompetitionCode.ENGLAND_PREMIER_LEAGUE]: 'premier-league',
  [CompetitionCode.ENGLAND_LEAGUE_CUP]: 'carabao-cup',
  // [CompetitionCode.ENGLAND_EFL_TROPHY]: 'efl-trophy',
  // [CompetitionCode.ENGLAND_FA_TROPHY]: 'fa-trophy',
  [CompetitionCode.ENGLAND_FA_CUP]: 'fa-cup',
  [CompetitionCode.ENGLAND_COMMUNITY_SHIELD]: 'community-shield',
  // [CompetitionCode.ENGLAND_PREMIER_LEAGUE_CUP]: 'premier-league-cup',

  // Spanien
  [CompetitionCode.SPAIN_LA_LIGA]: 'la-liga',
  [CompetitionCode.SPAIN_SUPER_CUP]: 'es-super-cup',
  [CompetitionCode.SPAIN_COPA_DEL_REY]: 'copa-del-rey',

  // Italien
  [CompetitionCode.ITALY_SERIE_A]: 'serie-a',
  // [CompetitionCode.ITALY_SUPER_CUP]: 'it-super-cup',
  [CompetitionCode.ITALY_COPPA_ITALIA]: 'coppa-italia',

  // Frankreich
  [CompetitionCode.FRANCE_LIGUE_1]: 'ligue-1',
  // [CompetitionCode.FRANCE_COUPE_DE_LA_LIGUE]: '65',
  [CompetitionCode.FRANCE_COUPE_DE_FRANCE]: 'coupe-de-france',
  [CompetitionCode.FRANCE_TROPHEE_DES_CHAMPIONS]: 'trophee-des-champions',

  // Niederlande
  [CompetitionCode.EREDIVISIE]: 'eredivisie',

  // USA
  [CompetitionCode.MAJOR_LEAGUE_SOCCER]: 'mls',
};
