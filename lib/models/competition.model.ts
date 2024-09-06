import { MongoDbId } from './mongodb.model';
import { Team } from './team.model';

export type StandingsPlayed = {
  played: number;
  win: number;
  draw: number;
  lose: number;
};

export type StandingRanks = {
  rank: number;
  team: Team;
  points: number;
  goalsDiff: number;
  group: string;
  form: string;
  status: string;
  description: string;
  all: StandingsPlayed;
  home: StandingsPlayed;
  away: StandingsPlayed;
  update: string;
};

export type LeagueType = 'League' | 'Cup' | 'Friendly' | 'International';
export type League = {
  id: CompetitionId;
  name: CompetitionLabel;
  country: string;
  logo: string;
  flag: string;
  season: number;
  round: CompetitionRound;
  standings?: StandingRanks[][];
};

export type CompetitionUrl = string;
export type CompetitionId = number;
export type CompetitionLabel = string;
export type CompetitionRound = string;

export type CompetitionRoundString = string;
export type CompetitionRounds = Record<CompetitionId, CompetitionRoundString>;
export type CompetitionMatchDayIndex = number;
export type CompetitionMatchDays = Record<
  CompetitionMatchDayIndex,
  CompetitionRounds
>;

export type Competition = {
  id: CompetitionId;
  name: string;
  country: string;
  logo: string;
  flag: string;
  season: number;
  round: string;
  standings?: StandingRanks[][];
};

export type CompetitionLeague = {
  id: CompetitionId;
  name: string;
  type: LeagueType;
  logo: string;
};
export type Country = {
  name: string;
  code: string;
  flag: string;
};
export type CoverageFixtures = {
  events: boolean;
  lineups: boolean;
  statistics_fixtures: boolean;
  statistics_players: boolean;
};
export type SeasonCoverage = {
  fixtures: CoverageFixtures;
  standings: boolean;
  players: boolean;
  top_scorers: boolean;
  top_assists: boolean;
  top_cards: boolean;
  injuries: boolean;
  predictions: boolean;
  odds: boolean;
};
export type Season = {
  year: number;
  start: string;
  end: string;
  current: boolean;
  coverage: SeasonCoverage;
};
export type CompetitionDTO = {
  _id: MongoDbId;
  league: CompetitionLeague;
  country: Country;
  seasons: Array<Season>;
};
