import {
  CompetitionId,
  CompetitionLabel,
  CompetitionRound,
} from './competition.model';
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
