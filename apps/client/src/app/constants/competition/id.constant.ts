import { CompetitionCode } from '../../constants';
import { CompetitionId } from '../../models';

export const COMPETITION_ID: Record<CompetitionCode, CompetitionId> = {
  [CompetitionCode.ENGLAND_PREMIER_LEAGUE]: '39',
  [CompetitionCode.GERMANY_BUNDESLIGA]: '78',
  [CompetitionCode.GERMANY_BUNDESLIGA_2]: '79',
  [CompetitionCode.ITALY_SERIE_A]: '135',
  [CompetitionCode.SPAIN_LA_LIGA]: '140',
  [CompetitionCode.FRANCE_LIGUE_1]: '61',

  // [CompetitionCode.ENGLAND_LEAGUE_CUP]: '48',
  // [CompetitionCode.ENGLAND_EFL_TROPHY]: '46',
  // [CompetitionCode.ENGLAND_FA_TROPHY]: '47',
  // [CompetitionCode.ENGLAND_FA_CUP]: '45',
  // [CompetitionCode.ENGLAND_COMMUNITY_SHIELD]: '528',
  // [CompetitionCode.ENGLAND_PREMIER_LEAGUE_CUP]: '871',
  // [CompetitionCode.GERMANY_SUPER_CUP]: '529',
  // [CompetitionCode.GERMANY_DFB_POKAL]: '81',
  // [CompetitionCode.ITALY_SUPER_CUP]: '547',
  // [CompetitionCode.ITALY_COPPA_ITALIA]: '137',
  // [CompetitionCode.SPAIN_SUPER_CUP]: '556',
  // [CompetitionCode.SPAIN_COPA_DEL_REY]: '143',
  // [CompetitionCode.FRANCE_COUPE_DE_LA_LIGUE]: '65',
  // [CompetitionCode.FRANCE_COUPE_DE_FRANCE]: '66',
  // [CompetitionCode.FRANCE_TROPHEE_DES_CHAMPIONS]: '526',

  // [CompetitionCode.INTERNATIONAL_UEFA_CHAMPIONS_LEAGUE]: '2',
  // [CompetitionCode.INTERNATIONAL_UEFA_EURO_LEAGUE]: '3',
  // [CompetitionCode.INTERNATIONAL_UEFA_SUPER_CUP]: '531',
};
