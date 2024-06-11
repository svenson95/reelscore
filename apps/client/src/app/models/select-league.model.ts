import { CompetitionLabel, CompetitionId, CompetitionUrl } from '@lib/models';

export interface SelectLeagueData {
  image: string;
  label: CompetitionLabel;
  id: CompetitionId;
  url: CompetitionUrl;
  size: number;
}
