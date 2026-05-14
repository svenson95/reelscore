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

const competitionCache24: Record<CompetitionId, string> = {};
export const getCompetitionLogo24 = (id: CompetitionId): string => {
  if (!competitionCache24[id]) {
    competitionCache24[id] = `${BASE}/league-24x24/${id}.png`;
  }
  return competitionCache24[id];
};

const teamCache: Record<TeamId, string> = {};
export const getTeamLogo = (id: number): string => {
  if (!teamCache[id]) {
    teamCache[id] = `${BASE}/team-logo/${id}.png`;
  }
  return teamCache[id];
};

const teamCache14: Record<TeamId, string> = {};
export const getTeamLogo14 = (id: number): string => {
  if (!teamCache14[id]) {
    teamCache14[id] = `${BASE}/team-logo-14x14/${id}.png`;
  }
  return teamCache14[id];
};
