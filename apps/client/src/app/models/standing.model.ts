import { Competition } from './competition.model';

export interface CompetitionStandings extends Competition {
  standings: Standing[];
}

export interface Standing {
  rank: number;
  team: string;
  played: number;
  won: number;
  draw: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}
