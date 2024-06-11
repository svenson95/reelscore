import { CompetitionLabel } from '@lib/models';
import { CompetitionCode } from '../../constants';

export const COMPETITION_LABEL: Record<CompetitionCode, CompetitionLabel> = {
  [CompetitionCode.ENGLAND_PREMIER_LEAGUE]: 'Premier League',
  [CompetitionCode.GERMANY_BUNDESLIGA]: 'Bundesliga',
  [CompetitionCode.GERMANY_BUNDESLIGA_2]: '2. Bundesliga',
  [CompetitionCode.ITALY_SERIE_A]: 'Serie A',
  [CompetitionCode.SPAIN_LA_LIGA]: 'La Liga',
  [CompetitionCode.FRANCE_LIGUE_1]: 'Ligue 1',
};
