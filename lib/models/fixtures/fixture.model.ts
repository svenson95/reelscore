import { League } from '../league.model';
import { Team } from '../team.model';
import { FixturePrediction } from './evaluated-fixture.model';

export type MongoDbId = string;
export type FixtureId = number | string; // TODO: refactor to string only
export type FixturePeriods = { first: number; second: number };
export type FixtureVenue = { id: number | null; name: string; city: string };
export type FixtureStatus = { long: string; short: string; elapsed: number };
export type FixtureResult = 'NO_RESULT_AVAILABLE' | 'WIN' | 'DRAW' | 'LOSS';
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
export type MatchTeams = { home: FixtureTeam; away: FixtureTeam };
export type Goals = { home: number | null; away: number | null };
export type Score = {
  halftime: Goals;
  fulltime: Goals;
  extratime: Goals;
  penalty: Goals;
};

export type FixtureDTO = {
  _id: MongoDbId;
  fixture: Fixture;
  league: League;
  teams: MatchTeams;
  goals: Goals;
  score: Score;
  prediction: FixturePrediction;
};

export interface LatestFixturesDTO {
  home: FixtureDTO[];
  away: FixtureDTO[];
}
