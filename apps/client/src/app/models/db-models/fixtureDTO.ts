import { Fixture, FixtureTeam, Goals, League, Score } from './fixture';

export interface MatchDTO {
  _id: string;
  fixture: Fixture;
  league: League;
  teams: {
    home: FixtureTeam;
    away: FixtureTeam;
  };
  goals: Goals;
  score: Score;
}

export interface PredictedMatchDTO extends MatchDTO {
  prediction?: {
    bet: string;
    qoute: number;
    presumption: number;
    correct: boolean;
  };
}
