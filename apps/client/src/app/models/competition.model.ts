import { Match } from './match';

export interface Competition {
  name: string;
  flag: string;
  list: Match[];
}
