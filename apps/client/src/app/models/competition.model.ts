import { CompetitionId, CompetitionLabel } from '@lib/models';

export interface Competition {
  id: CompetitionId;
  name: CompetitionLabel;
  image: string;
}

const BASE = 'assets/images';
export const getCompetitionLogo = (id: number) => `${BASE}/league/${id}.png`;
export const getTeamLogo = (id: number) => `${BASE}/team-logo/${id}.png`;
