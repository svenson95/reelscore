import { CompetitionCode } from '../../constants';
import { CompetitionLabel } from '../../models';

export const COMPETITION_LABEL: Record<CompetitionCode, CompetitionLabel> = {
  [CompetitionCode.ENGLAND_PREMIER_LEAGUE]: 'Premiere League',
  [CompetitionCode.GERMANY_BUNDESLIGA]: 'Bundesliga',
  [CompetitionCode.GERMANY_BUNDESLIGA_2]: '2. Bundesliga',
  [CompetitionCode.ITALY_SERIE_A]: 'Serie A',
  [CompetitionCode.SPAIN_LA_LIGA]: 'La Liga',
  [CompetitionCode.FRANCE_LIGUE_1]: 'Ligue 1',
};
