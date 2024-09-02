export interface Competition {
  name: string;
  image: string;
}

const BASE = 'assets/images';
export const getCompetitionLogo = (id: number) => `${BASE}/league/${id}.png`;
export const getTeamLogo = (id: number) => `${BASE}/team-logo/${id}.png`;
