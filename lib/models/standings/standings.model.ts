import { MongoDbId } from '../fixtures/fixture.model';
import { League } from '../league.model';

export interface StandingsDTO {
  _id: MongoDbId;
  league: League;
  createdAt: Date;
  updatedAt: Date;
}
