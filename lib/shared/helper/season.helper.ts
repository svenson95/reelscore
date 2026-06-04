import moment from 'moment-timezone';

import type {
  CompetitionId,
  CompetitionSeason,
} from '../../models/competition.model';
import { isCompetitionSeason } from './competition.helper';

const TIMEZONE = 'Europe/Berlin';

const FIXED_SEASON_BY_COMPETITION = new Map<CompetitionId, CompetitionSeason>([
  [32, 2024], // World Cup Qualifiers Europe
  [1, 2026], // World Cup
  [10, 2026], // Friendlies
  [253, 2026], // Friendlies
]);

export const getSeason = (
  competition: CompetitionId | null = null,
  date: string | null = null
): CompetitionSeason => {
  const today = date ? moment.tz(date, TIMEZONE) : moment().tz(TIMEZONE);
  const competitionId = Number(competition);

  return (
    FIXED_SEASON_BY_COMPETITION.get(competitionId) ??
    getRegularCompetitionSeason(today)
  );
};

const getRegularCompetitionSeason = (
  today: moment.Moment
): CompetitionSeason => {
  const seasonStartCutoff = today.clone().month(7).date(1);

  const season = today.isSameOrBefore(seasonStartCutoff)
    ? today.year() - 1
    : today.year();

  if (!isCompetitionSeason(season)) {
    throw new Error(`Unsupported competition season: ${season}`);
  }

  return season;
};
