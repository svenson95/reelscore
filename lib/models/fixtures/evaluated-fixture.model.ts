import { FixtureDTO } from './fixture.model';

export type FixturePrediction = {
  bet: string;
  qoute: number;
  presumption: number;
  correct: boolean;
};
export type AnalysisLevel = 'GOOD' | 'BAD';
export type AnalysisType = 'RED_CARD' | 'PENALTY' | 'INJURY';
export type FixtureAnalysis = {
  level: AnalysisLevel;
  minute: number;
  type: AnalysisType;
  playerId: string | null;
  comments: string;
};
export type EvaluationPerformance = 'LOW' | 'MIDDLE' | 'HIGH';
export type FixtureEvaluation = {
  performance: EvaluationPerformance;
  analyses: FixtureAnalysis[];
};

export interface EvaluatedFixtureDTO extends FixtureDTO {
  prediction?: FixturePrediction;
  evaluation?: { home: FixtureEvaluation; away: FixtureEvaluation };
}
