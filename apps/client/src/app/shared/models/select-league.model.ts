import { CompetitionId, CompetitionName, CompetitionUrl } from '@lib/models';

export type CompetitionData = {
  image: string;
  label: CompetitionName;
  id: CompetitionId;
  url: CompetitionUrl;
  size: number;
};

export type SelectCompetitionGroup = {
  label: string;
  competitions: CompetitionData[];
};
