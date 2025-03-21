import { EvaluationAnalyses, ExtendedFixtureDTO } from '@lib/models';

export type AnalysesTeam = 'home' | 'away';
export interface ExtendedEvaluationAnalyses extends EvaluationAnalyses {
  team: AnalysesTeam;
}

export interface FixtureWithEvaluations extends ExtendedFixtureDTO {
  flatEvaluations: ExtendedEvaluationAnalyses[];
}
