import { StandingRanks } from './standings.model';

export interface League {
  id: number;
  name: string;
  country: string;
  logo: string;
  flag: string;
  season: number;
  round: string;
  standings?: StandingRanks[][];
}
