import moment from 'moment-timezone';

import type {
  CompetitionId,
  CompetitionSeason,
} from '../../models/competition.model';
import { FIXED_SEASON_BY_COMPETITION } from '../constants/season.data';

import { isCompetitionSeason } from './competition.helper';
import { TIMEZONE } from './date.helper';

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
