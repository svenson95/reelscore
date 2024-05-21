import { Match } from './match.model';

export interface Competition {
  name: string;
  flag: string;
  list: Match[];
}
