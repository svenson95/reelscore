import { League } from '../league.model';

export const logoFromAssets = (teamId: number) => {
  return 'assets/images/team-logo/' + teamId + '.png';
};

export interface StandingsDTO {
  league: League;
}
