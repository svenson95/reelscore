export type Team = { id: number; name: string; logo: string };

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

export type CompetitionUrl = string;
export type CompetitionId = number;
export type CompetitionLabel = string;

export type League = {
  id: CompetitionId;
  name: CompetitionLabel;
  country: string;
  logo: string;
  flag: string;
  season: number;
  round: string;
  standings?: StandingRanks[][];
};
