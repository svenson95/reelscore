import { CompetitionId, CompetitionLabel, CompetitionUrl } from '@lib/models';

export type CompetitionData = {
  image: string;
  label: CompetitionLabel;
  id: CompetitionId;
  url: CompetitionUrl;
  size: number;
};

export type SelectCompetitionGroup = {
  label: string;
  competitions: CompetitionData[];
};
