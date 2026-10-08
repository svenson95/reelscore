import type {
  CompetitionId,
  CompetitionName,
  CompetitionUrl,
} from '@reelscore-sdk/models';

export type CompetitionData = {
  image: string;
  imageSet: string;
  label: CompetitionName;
  id: CompetitionId;
  url: CompetitionUrl;
};

export type SelectCompetitionGroup = {
  label: string;
  competitions: CompetitionData[];
};
