import { FixtureId, FixtureResult } from './fixture.model';

export type FixturePerformance = 'LOW' | 'MIDDLE' | 'HIGH';
export type EvaluationTeam = {
  performances: FixturePerformance[];
  results: FixtureResult[];
};
export type EvaluationTeams = { home: EvaluationTeam; away: EvaluationTeam };
export type EvaluationDTO = {
  fixture: FixtureId;
  teams: EvaluationTeams;
};
