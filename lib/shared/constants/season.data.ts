import type {
  CompetitionId,
  CompetitionRound,
  CompetitionSeason,
} from '../../models/competition.model';

export const COMPETITIONS_WITH_MULTIPLE_GROUPS: CompetitionId[] = [
  1, 4, 5, 31, 32,
] as const;
export const COMPETITIONS_WITHOUT_STANDINGS: CompetitionId[] = [
  10, 48, 81, 137, 528, 529, 531,
] as const;
export const COMPETITIONS_WITH_ONLY_ONE_FIXTURE: CompetitionId[] = [
  528, 529, 531,
] as const;

export const ROUNDS_KO_PHASE: CompetitionRound[] = [
  'Round of 16',
  'Quarter-finals',
  'Final',
  'Semi-finals',
] as const;

export const SEASONS: number[] = [2023, 2024, 2025, 2026] as const;

export const FIXED_SEASON_BY_COMPETITION = new Map<
  CompetitionId,
  CompetitionSeason
>([
  [32, 2024], // World Cup Qualifiers Europe
  [1, 2026], // World Cup
  [10, 2026], // Friendlies
  [253, 2026], // Friendlies
]);
