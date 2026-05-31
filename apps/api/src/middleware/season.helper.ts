import moment from 'moment-timezone';

import type { CompetitionId } from '@lib/models';

const TIMEZONE = 'Europe/Berlin';

const FIXED_SEASON_BY_COMPETITION = new Map<number, number>([
  [32, 2024], // World Cup Qualifiers Europe
  [1, 2026], // World Cup
  [10, 2026], // Friendlies
  [253, 2026], // Friendlies
]);

export const getSeason = (
  competition: CompetitionId | null = null,
  date: string | null = null
): number => {
  const today = date ? moment.tz(date, TIMEZONE) : moment().tz(TIMEZONE);
  const competitionId = Number(competition);

  return (
    FIXED_SEASON_BY_COMPETITION.get(competitionId) ??
    getRegularCompetitionSeason(today)
  );
};

const getRegularCompetitionSeason = (today: moment.Moment): number => {
  const seasonStartCutoff = today.clone().month(7).date(1);

  return today.isSameOrBefore(seasonStartCutoff)
    ? today.year() - 1
    : today.year();
};
