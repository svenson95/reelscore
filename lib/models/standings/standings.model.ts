import type { CompetitionId, MongoDbId } from '@reelscore-sdk/models';

import type { StandingsLeague } from '../competition.model';

export interface StandingsDTO {
  _id: MongoDbId;
  league: StandingsLeague;
  createdAt: Date;
  updatedAt: Date;
}

export type StandingsFilter = {
  'league.id': CompetitionId;
  'league.season': number;
};
