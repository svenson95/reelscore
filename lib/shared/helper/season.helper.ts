import type { Moment } from 'moment';

import type {
  CompetitionId,
  CompetitionSeason,
} from '../../models/competition.model';
import {
  FIXED_SEASON_BY_COMPETITION,
  SEASON_START_CUTOFF,
} from '../constants/season.data';

import { isCompetitionSeason } from './competition.helper';
import { getDateInTimezone, getNow } from './date.helper';

export const getSeason = (
  competition: CompetitionId | null = null,
  date: string | null = null
): CompetitionSeason => {
  const today = date ? getDateInTimezone(date) : getNow();
  const competitionId = Number(competition);

  return (
    FIXED_SEASON_BY_COMPETITION.get(competitionId) ??
    getRegularCompetitionSeason(today)
  );
};

const getRegularCompetitionSeason = (today: Moment): CompetitionSeason => {
  const season = today.isSameOrBefore(SEASON_START_CUTOFF)
    ? today.year() - 1
    : today.year();

  if (!isCompetitionSeason(season)) {
    throw new Error(`Unsupported competition season: ${season}`);
  }

  return season;
};
