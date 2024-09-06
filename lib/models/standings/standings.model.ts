import { League } from '../competition.model';
import { MongoDbId } from '../mongodb.model';

export interface StandingsDTO {
  _id: MongoDbId;
  league: League;
  createdAt: Date;
  updatedAt: Date;
}
