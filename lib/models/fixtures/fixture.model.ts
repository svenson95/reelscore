import { League } from '../competition.model';
import { MongoDbId } from '../mongodb.model';
import { Team, TeamId } from '../team.model';
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
export type StatusShort =
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
export type StatusTypeScheduled = 'TBD' | 'NS';
export type StatusTypeInPlay =
  | '1H'
  | 'HT'
  | '2H'
  | 'ET' // Extra time in play
  | 'BT' // Break during extra time
  | 'P' // Penaly played after extra time
  | 'SUSP' // Suspended by referee's decision, may be rescheduled another day
  | 'INT' // Interrupted by referee's decision, should resume in a few minutes
  | 'LIVE'; // indicates a fixture in progress but the data indicating the half-time or elapsed time are not available
export type StatusTypeFinished = 'FT' | 'AET' | 'PEN';
export type StatusTypePostponed = 'PST';
export type StatusTypeCancelled = 'CANC';
export type StatusTypeAbandoned = 'ABD';
export type StatusTypeNotPlayed =
  | 'AWD' // Technical Loss
  | 'WO'; // WalkOver, victory by forfeit or absence of competitor

export type FixtureDetail =
  | 'lineups'
  | 'fixture-statistics'
  | 'players-statistics'
  | 'events';

export type FixtureId = number | string; // TODO: refactor to string only
export type FixtureDateString = string;
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
  date: FixtureDateString;
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

export type FixtureFinal = {
  firstLegResult: Goals | null;
  winnerOfFinal: TeamId | null;
};

export type FixtureDTO = {
  _id: MongoDbId;
  fixture: Fixture;
  league: League;
  teams: MatchTeams;
  goals: Goals;
  score: Score;
};

export interface ExtendedFixtureDTO extends FixtureDTO {
  final: FixtureFinal;
  prediction?: FixturePrediction;
  evaluations?: FixtureEvaluations;
}

export const PREDICTION_PROBABILITIES = [0.75, 0.8, 0.85, 0.9, 0.95] as const;
export type PredictionProbability = (typeof PREDICTION_PROBABILITIES)[number];
export type FixturePrediction = {
  bet: string;
  qoute: number;
  probability: PredictionProbability; // in %
  correct: boolean;
};
export type AnalysisLevel = 'LUCKY' | 'UNLUCKY';
export type AnalysisType =
  | 'GOAL'
  | 'NO_GOAL'
  | 'LAST_MINUTE_GOAL'
  | 'NO_FOUL'
  | 'PENALTY'
  | 'NO_PENALTY'
  | 'RED_CARD'
  | 'NO_RED_CARD'
  | 'KEY_PLAYER_INJURY'
  | 'KEY_PLAYER_YELLOW_CARD_SUSPENSION';
export type EvaluationAnalyses = {
  level: AnalysisLevel;
  type: AnalysisType;
  minute: number | null;
  player: string | null;
  comments: string | null;
};
export type EvaluationPerformance = 'LOW' | 'MIDDLE' | 'HIGH';
export type FixtureEvaluation = {
  performance: EvaluationPerformance;
  analyses: EvaluationAnalyses[];
};
export type FixtureEvaluations = {
  home: FixtureEvaluation;
  away: FixtureEvaluation;
};

export interface LatestFixturesDTO {
  home: ExtendedFixtureDTO[];
  away: ExtendedFixtureDTO[];
}

export type FixtureHighlights = EventDTO[];
// TODO refactor naming GetFixtureDTO -> FixtureWithHighlights
export interface GetFixtureDTO {
  data: ExtendedFixtureDTO;
  highlights: FixtureHighlights;
}
