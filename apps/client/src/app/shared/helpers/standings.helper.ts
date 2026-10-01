import type { StandingsDTO } from '@reelscore-sdk/models';

export const showHomeAndAwayStandings = (standings: StandingsDTO): boolean => {
  return standings.league.standings?.length === 3;
};
