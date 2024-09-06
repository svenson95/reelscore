import { CompetitionId, CompetitionLabel, FixtureDTO } from '@lib/models';

export interface Competition {
  id: CompetitionId;
  name: CompetitionLabel;
  image: string;
}

export interface CompetitionWithFixtures extends Competition {
  fixtures: FixtureDTO[];
}

const BASE = 'assets/images';
export const getCompetitionLogo = (id: CompetitionId) =>
  `${BASE}/league/${id}.png`;
export const getTeamLogo = (id: number) => `${BASE}/team-logo/${id}.png`;
