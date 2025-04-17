import { EvaluationAnalyses, ExtendedFixtureDTO } from '@lib/models';

export const AnalysesTeam = {
  HOME: 'home',
  AWAY: 'away',
} as const;

export type AnalysesTeamType = (typeof AnalysesTeam)[keyof typeof AnalysesTeam];
export interface ExtendedEvaluationAnalyses extends EvaluationAnalyses {
  team: AnalysesTeamType;
}

export interface FixtureWithEvaluations extends ExtendedFixtureDTO {
  flatEvaluations: ExtendedEvaluationAnalyses[];
}
