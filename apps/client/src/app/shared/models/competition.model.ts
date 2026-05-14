import {
  CompetitionId,
  CompetitionName,
  ExtendedFixtureDTO,
  TeamId,
} from '@lib/models';

export interface Competition {
  id: CompetitionId;
  name: CompetitionName;
  image: string;
  url: string[];
}

export interface CompetitionWithFixtures extends Competition {
  fixtures: ExtendedFixtureDTO[];
}

const BASE = 'assets/images';

const competitionCache: Record<CompetitionId, string> = {};
export const getCompetitionLogo = (id: CompetitionId): string => {
  if (!competitionCache[id]) {
    competitionCache[id] = `${BASE}/league/${id}.png`;
  }
  return competitionCache[id];
};
export const getCompetitionLogo24 = (id: CompetitionId): string => {
  if (!competitionCache[id]) {
    competitionCache[id] = `${BASE}/league-24x24/${id}.png`;
  }
  return competitionCache[id];
};

const teamCache: Record<TeamId, string> = {};
export const getTeamLogo = (id: number): string => {
  if (!teamCache[id]) {
    teamCache[id] = `${BASE}/team-logo/${id}.png`;
  }
  return teamCache[id];
};

export const getTeamLogo14 = (id: number): string => {
  if (!teamCache[id]) {
    teamCache[id] = `${BASE}/team-logo-14x14/${id}.png`;
  }
  return teamCache[id];
};
