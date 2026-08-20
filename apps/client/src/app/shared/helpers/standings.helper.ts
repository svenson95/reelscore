import type { StandingsDTO } from '@lib/models';
import { isCompetitionWithMultipleGroups } from '@lib/shared';

export const hasMultipleGroups = (standings: StandingsDTO): boolean => {
  return isCompetitionWithMultipleGroups(
    standings.league.id,
    standings.league.season
  );
};

export const showHomeAndAwayStandings = (standings: StandingsDTO): boolean => {
  return standings.league.standings?.length === 3;
};
