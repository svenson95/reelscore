import { LeagueId } from '../constants';

export interface SelectLeagueData {
  image: string;
  label: string;
  id: LeagueId;
  url: string;
}

export type SelectLeagueState = SelectLeagueData | undefined;
