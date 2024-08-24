import { MongoDbId } from '../fixtures/fixture.model';
import { League } from '../league.model';

export const logoFromAssets = (teamId: number) => {
  return 'assets/images/team-logo/' + teamId + '.png';
};

export interface StandingsDTO {
  _id: MongoDbId;
  league: League;
  createdAt: Date;
  updatedAt: Date;
}
