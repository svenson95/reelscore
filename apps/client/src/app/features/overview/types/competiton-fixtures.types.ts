import type {
  CompetitionId,
  CompetitionName,
  ExtendedFixtureDTO,
} from '@reelscore-sdk/models';

interface Competition {
  id: CompetitionId;
  name: CompetitionName;
  image: string;
  url: string[];
}

export interface CompetitionWithFixtures extends Competition {
  fixtures: ExtendedFixtureDTO[];
}
