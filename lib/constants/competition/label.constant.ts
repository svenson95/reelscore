import { CompetitionLabel } from '../../models';
import { CompetitionCode } from './code.constant';

export const COMPETITION_LABEL: Record<CompetitionCode, CompetitionLabel> = {
  // Europa
  [CompetitionCode.EUROPA_UEFA_CHAMPIONS_LEAGUE]: 'Champions League',
  [CompetitionCode.EUROPA_UEFA_EURO_LEAGUE]: 'Europa League',
  [CompetitionCode.EUROPA_UEFA_SUPER_CUP]: 'UEFA Super Cup',

  // International
  // [CompetitionCode.INTERNATIONAL_EURO_CHAMPIONSHIP]: 'Euro Championship',
  // [CompetitionCode.INTERNATIONAL_CONFEDARATIONS_CUP]: 'Confedarations Cup',
  // [CompetitionCode.INTERNATIONAL_WORLD_CUP]: 'World Cup',
  // [CompetitionCode.INTERNATIONAL_FIFA_WORLD_CUP]: 'FIFA World Cup',
  [CompetitionCode.INTERNATIONAL_UEFA_NATIONS_LEAGUE]: 'UEFA Nations League',

  // Deutschland
  [CompetitionCode.GERMANY_BUNDESLIGA]: 'Bundesliga',
  [CompetitionCode.GERMANY_BUNDESLIGA_2]: '2. Bundesliga',
  [CompetitionCode.GERMANY_SUPER_CUP]: 'DFL Supercup',
  [CompetitionCode.GERMANY_DFB_POKAL]: 'DFB Pokal',

  // England
  [CompetitionCode.ENGLAND_PREMIER_LEAGUE]: 'Premier League',
  // [CompetitionCode.ENGLAND_LEAGUE_CUP]: 'League Cup',
  // [CompetitionCode.ENGLAND_EFL_TROPHY]: 'EFL Trophy',
  [CompetitionCode.ENGLAND_FA_TROPHY]: 'FA Trophy',
  // [CompetitionCode.ENGLAND_FA_CUP]: 'FA Cup',
  [CompetitionCode.ENGLAND_COMMUNITY_SHIELD]: 'Community Shield',
  // [CompetitionCode.ENGLAND_PREMIER_LEAGUE_CUP]: 'Premier League Cup',

  // Spanien
  [CompetitionCode.SPAIN_LA_LIGA]: 'La Liga',
  // [CompetitionCode.SPAIN_SUPER_CUP]: 'Supercopa de España',
  [CompetitionCode.SPAIN_COPA_DEL_REY]: 'Copa del Rey',

  // Italien
  [CompetitionCode.ITALY_SERIE_A]: 'Serie A',
  // [CompetitionCode.ITALY_SUPER_CUP]: 'Supercoppa Italiana',
  [CompetitionCode.ITALY_COPPA_ITALIA]: 'Coppa Italia',

  // Frankreich
  [CompetitionCode.FRANCE_LIGUE_1]: 'Ligue 1',
  // [CompetitionCode.FRANCE_COUPE_DE_LA_LIGUE]: 'Coupe de la Ligue',
  [CompetitionCode.FRANCE_COUPE_DE_FRANCE]: 'Coupe de France',
  [CompetitionCode.FRANCE_TROPHEE_DES_CHAMPIONS]: 'Trophée des Champions',
};
