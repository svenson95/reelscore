import { League } from './league.model';
import { MongoDbId } from './mongo-db.model';
import { Team } from './standings.model';

export type MatchTeams = { home: FixtureTeam; away: FixtureTeam };
export type Goals = { home: number | null; away: number | null };
export type Score = {
  halftime: Goals;
  fulltime: Goals;
  extratime: Goals;
  penalty: Goals;
};

export type MatchDTO = {
  _id: MongoDbId;
  fixture: Fixture;
  league: League;
  teams: MatchTeams;
  goals: Goals;
  score: Score;
};

export interface PredictedMatchDTO extends MatchDTO {
  prediction?: {
    bet: string;
    qoute: number;
    presumption: number;
    correct: boolean;
  };
}

export interface GetAllFixturesDTO {
  data: MatchDTO[];
  length: number;
}

export interface LatestFixturesDTO {
  home: MatchDTO[];
  away: MatchDTO[];
}

export type FixtureId = number | string;
export type FixturePeriods = { first: number; second: number };
export type FixtureVenue = { id: number | null; name: string; city: string };
export type FixtureStatus = { long: string; short: string; elapsed: number };
export interface Fixture {
  id: FixtureId;
  referee: string;
  timezone: string;
  date: string;
  timestamp: number;
  periods: FixturePeriods;
  venue: FixtureVenue;
  status: FixtureStatus;
}

export interface FixtureTeam extends Team {
  winner: boolean;
}
