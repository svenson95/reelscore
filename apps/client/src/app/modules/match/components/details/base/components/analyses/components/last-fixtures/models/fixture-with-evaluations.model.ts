import type { EvaluationAnalyses, ExtendedFixtureDTO } from '@lib/models';

export const ANALYSES_TEAM = {
  HOME: 'home',
  AWAY: 'away',
} as const;

export type AnalysesTeamType =
  (typeof ANALYSES_TEAM)[keyof typeof ANALYSES_TEAM];
export interface ExtendedEvaluationAnalyses extends EvaluationAnalyses {
  team: AnalysesTeamType;
}

export interface FixtureWithEvaluations extends ExtendedFixtureDTO {
  flatEvaluations: ExtendedEvaluationAnalyses[];
}
