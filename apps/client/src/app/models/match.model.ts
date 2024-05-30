import { MatchDTO } from '@lib/models';

import { Competition } from './competition.model';

export type MatchState = 'upcoming' | 'finished';
export type MatchPriority = 'low' | 'mid' | 'high';

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  date: Date;
  state: MatchState;
  result: { half_time: string; full_time: string } | null;
  priority: MatchPriority;
}

export interface CompetitionFixtures extends Competition {
  fixtures: MatchDTO[];
}
