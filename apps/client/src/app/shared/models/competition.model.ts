import {
  CompetitionId,
  CompetitionLabel,
  ExtendedFixtureDTO,
} from '@lib/models';

export interface Competition {
  id: CompetitionId;
  name: CompetitionLabel;
  image: string;
  url: string[];
}

export interface CompetitionWithFixtures extends Competition {
  fixtures: ExtendedFixtureDTO[];
}

const BASE = 'assets/images';
export const getCompetitionLogo = (id: CompetitionId): string =>
  `${BASE}/league/${id}.png`;
export const getTeamLogo = (id: number): string =>
  `${BASE}/team-logo/${id}.png`;
