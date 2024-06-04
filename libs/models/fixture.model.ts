import { MongoDbId } from './mongo-db.model';
import { StandingsRanks, Team } from './standings.model';

export type FixtureId = number | string;

export interface GetAllFixturesDTO {
  data: MatchDTO[];
  length: number;
}

export interface LatestFixturesDTO {
  home: MatchDTO[];
  away: MatchDTO[];
}

export interface MatchDTO {
  _id: MongoDbId;
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

export interface Fixture {
  id: FixtureId;
  referee: string;
  timezone: string;
  date: string;
  timestamp: number;
  periods: {
    first: number;
    second: number;
  };
  venue: {
    id: number | null;
    name: string;
    city: string;
  };
  status: {
    long: string;
    short: string;
    elapsed: number;
  };
}

export interface League {
  id: number;
  name: string;
  country: string;
  logo: string;
  flag: string;
  season: number;
  round: string;
  standings?: StandingsRanks[][];
}

export interface FixtureTeam extends Team {
  winner: boolean;
}

export interface FixtureTeams {
  home: FixtureTeam;
  away: FixtureTeam;
}

export interface Goals {
  home: number | null;
  away: number | null;
}

export interface Score {
  halftime: Goals;
  fulltime: Goals;
  extratime: Goals;
  penalty: Goals;
}
