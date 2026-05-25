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

type ImageScale = 1 | 2 | 3;
type TeamLogoSize = 14 | 48;

const getTeamLogoFolder = (size: TeamLogoSize): string => `${size}x${size}`;

const getTeamLogoBySizeAndScale = (
  id: TeamId,
  size: TeamLogoSize,
  scale: ImageScale
): string =>
  getCachedImagePath(
    `team-${size}-${id}@${scale}x`,
    `${BASE}/team-logo-responsive/${getTeamLogoFolder(
      size
    )}/${id}@${scale}x.png`
  );

export const getTeamLogo = (
  id: TeamId,
  size: TeamLogoSize,
  scale: ImageScale = 1
): string => getTeamLogoBySizeAndScale(id, size, scale);

export const getTeamLogoSrcSet = (id: TeamId, size: TeamLogoSize): string =>
  [
    `${getTeamLogoBySizeAndScale(id, size, 1)} 1x`,
    `${getTeamLogoBySizeAndScale(id, size, 2)} 2x`,
    `${getTeamLogoBySizeAndScale(id, size, 3)} 3x`,
  ].join(', ');
