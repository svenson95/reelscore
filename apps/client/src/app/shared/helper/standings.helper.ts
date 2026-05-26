import { StandingsDTO } from '@lib/models';
import { isCompetitionWithMultipleGroups } from '@lib/shared';

export const hasMultipleGroups = (standings: StandingsDTO | null) => {
  if (!standings) return false;
  return isCompetitionWithMultipleGroups(standings.league.id);
};

export const showHomeAndAwayStandings = (standings: StandingsDTO | null) => {
  if (!standings) return false;
  return standings.league.standings?.length === 3;
};
