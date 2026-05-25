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

const cache: Record<string, string> = {};

const getCachedImagePath = (key: string, path: string): string => {
  if (!cache[key]) {
    cache[key] = path;
  }

  return cache[key];
};

export const getCompetitionLogo = (id: CompetitionId): string =>
  getCachedImagePath(`competition-${id}`, `${BASE}/league/${id}.png`);

export const getCompetitionLogo24 = (id: CompetitionId): string =>
  getCachedImagePath(`competition-24-${id}`, `${BASE}/league-24x24/${id}.png`);

const getTeamLogoByScale = (id: TeamId, scale: 1 | 2 | 3): string =>
  getCachedImagePath(
    `team-${id}@${scale}x`,
    `${BASE}/team-logo-responsive/${id}@${scale}x.png`
  );

export const getTeamLogo14 = (id: TeamId): string => getTeamLogoByScale(id, 1);
export const getTeamLogo28 = (id: TeamId): string => getTeamLogoByScale(id, 2);
export const getTeamLogo42 = (id: TeamId): string => getTeamLogoByScale(id, 3);

export const getTeamLogoSrcSet = (id: TeamId): string =>
  [
    `${getTeamLogo14(id)} 1x`,
    `${getTeamLogo28(id)} 2x`,
    `${getTeamLogo42(id)} 3x`,
  ].join(', ');
