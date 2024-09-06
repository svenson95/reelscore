import { League } from '../league.model';
import { MongoDbId } from '../mongodb.model';

export interface StandingsDTO {
  _id: MongoDbId;
  league: League;
  createdAt: Date;
  updatedAt: Date;
}
