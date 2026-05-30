import moment from 'moment-timezone';

import { CompetitionId } from '@lib/models';

const TIMEZONE = 'Europe/Berlin';

const MLS_ID = 253;

const FIXED_SEASON_BY_COMPETITION = new Map<number, number>([
  [32, 2024], // World Cup Qualifiers Europe
  [1, 2026], // World Cup
  [10, 2026], // Friendlies
]);

export const getSeason = (competition: CompetitionId | null = null): number => {
  const today = moment().tz(TIMEZONE);
  const competitionId = Number(competition);

  if (competitionId === MLS_ID) {
    return today.year();
  }

  return (
    FIXED_SEASON_BY_COMPETITION.get(competitionId) ??
    getRegularCompetitionSeason(today)
  );
};

const getRegularCompetitionSeason = (today: moment.Moment): number => {
  const seasonStartCutoff = today.clone().month(5).date(9);

  return today.isSameOrBefore(seasonStartCutoff)
    ? today.year() - 1
    : today.year();
};
