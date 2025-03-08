import { League } from '../competition.model';
import { MongoDbId } from '../mongodb.model';
import { Team } from '../team.model';
import { FixturePrediction } from './evaluated-fixture.model';
import { EventDTO } from './events.model';

type StatusLong =
  | 'Time To Be Defined'
  | 'Not Started'
  | 'First Half, Kick Off'
  | 'Halftime'
  | 'Second Half, 2nd Half Started'
  | 'Extra Time'
  | 'Break Time'
  | 'Penalty in Progress'
  | 'Match Suspended'
  | 'Match Interrupted'
  | 'Match Finished'
  | 'Match Postponed'
  | 'Match Cancelled'
  | 'Match Abandoned'
  | 'Technical Loss'
  | 'WalkOver'
  | 'In Progress';
type StatusShort =
  | 'TBD'
  | 'NS'
  | '1H'
  | 'HT'
  | '2H'
  | 'ET'
  | 'BT'
  | 'P'
  | 'SUSP'
  | 'INT'
  | 'FT'
  | 'AET'
  | 'PEN'
  | 'PST'
  | 'CANC'
  | 'ABD'
  | 'AWD'
  | 'WO'
  | 'LIVE';
export type FixtureDetail =
  | 'lineups'
  | 'fixture-statistics'
  | 'players-statistics'
  | 'events';

type NotStartedMatchStatus = 'TBD' | 'NS';
const NotStartedMatchStatusValues: NotStartedMatchStatus[] = ['TBD', 'NS'];
export const isNotStarted = (fixture: Fixture) =>
  NotTypeOf(fixture, NotStartedMatchStatusValues);

type FinishedMatchStatus = 'FT' | 'AET' | 'PEN';
const FinishedMatchStatusValues: FinishedMatchStatus[] = ['FT', 'AET', 'PEN'];
export const isFinished = (fixture: Fixture) =>
  NotTypeOf(fixture, FinishedMatchStatusValues);

function NotTypeOf(fixture: Fixture, types: StatusShort[]): boolean {
  return types.some((value) => value === fixture.status.short);
}

export type FixtureId = number | string; // TODO: refactor to string only
export type FixturePeriods = { first: number; second: number };
export type FixtureVenue = { id: number | null; name: string; city: string };
export type FixtureStatus = {
  long: StatusLong;
  short: StatusShort;
  elapsed: number;
};
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

export type FixtureHighlights = EventDTO[];
export interface GetFixtureDTO {
  data: FixtureDTO;
  highlights: FixtureHighlights;
}
