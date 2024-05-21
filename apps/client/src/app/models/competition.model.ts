import { COMPETITION_URL } from '../constants';

export interface Competition {
  name: string;
}

export type CompetitionUrl = keyof typeof COMPETITION_URL;
