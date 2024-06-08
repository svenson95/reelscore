import { League } from './league.model';

export interface StandingsPlayed {
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

export const logoFromAssets = (teamId: number) => {
  return 'assets/images/team-logo/' + teamId + '.png';
};

export interface StandingRanks {
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

export interface StandingsDTO {
  league: League;
}
