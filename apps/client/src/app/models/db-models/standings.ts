import { League } from './fixture';

interface StandingsPlayed {
  played: number;
  win: number;
  draw: number;
  lose: number;
}

export interface Team {
  id: number;
  name: string;
  logo: string;
}

export interface StandingsRanks {
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
}

export interface Standings {
  league: League;
}
