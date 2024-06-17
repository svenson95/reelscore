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
};
