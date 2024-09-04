import { CompetitionId, CompetitionLabel } from '@lib/models';

export interface Competition {
  id: CompetitionId;
  name: CompetitionLabel;
  image: string;
}

const BASE = 'assets/images';
const suffix = (v: boolean) => (v ? '-thumbnail' : '');
export const getCompetitionLogo = (id: CompetitionId, thumbnail = true) =>
  `${BASE}/league/${id}${suffix(thumbnail)}.png`;
export const getTeamLogo = (id: number, thumbnail = true) =>
  `${BASE}/team-logo/${id}${suffix(thumbnail)}.png`;
