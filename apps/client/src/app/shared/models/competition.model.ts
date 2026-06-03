import type {
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

type ImageScale = 1 | 2 | 3;

type TeamLogoSize = 14 | 48;
type CompetitionLogoSize = 24 | 64;

const BASE = 'assets/images';

const cache: Record<string, string> = {};

const getCachedImagePath = (key: string, path: string): string => {
  if (!cache[key]) {
    cache[key] = path;
  }

  return cache[key];
};

const getResponsiveImagePath = <Id extends string | number>(
  type: 'team' | 'competition',
  baseFolder: string,
  id: Id,
  size: number,
  scale: ImageScale
): string =>
  getCachedImagePath(
    `${type}-${size}-${id}@${scale}x`,
    `${BASE}/${baseFolder}/${size}x${size}/${id}@${scale}x.png`
  );

const getTeamLogoBySizeAndScale = (
  id: TeamId,
  size: TeamLogoSize,
  scale: ImageScale
): string =>
  getResponsiveImagePath('team', 'team-logo-responsive', id, size, scale);

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

const getCompetitionLogoBySizeAndScale = (
  id: CompetitionId,
  size: CompetitionLogoSize,
  scale: ImageScale
): string =>
  getResponsiveImagePath(
    'competition',
    'competition-responsive',
    id,
    size,
    scale
  );

export const getCompetitionLogo = (
  id: CompetitionId,
  size: CompetitionLogoSize,
  scale: ImageScale = 1
): string => getCompetitionLogoBySizeAndScale(id, size, scale);

export const getCompetitionLogoSrcSet = (
  id: CompetitionId,
  size: CompetitionLogoSize
): string =>
  [
    `${getCompetitionLogoBySizeAndScale(id, size, 1)} 1x`,
    `${getCompetitionLogoBySizeAndScale(id, size, 2)} 2x`,
    `${getCompetitionLogoBySizeAndScale(id, size, 3)} 3x`,
  ].join(', ');
