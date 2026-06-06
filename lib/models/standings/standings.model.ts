import type { CompetitionId, StandingsLeague } from '../competition.model';
import type { MongoDbId } from '../mongodb.model';

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
