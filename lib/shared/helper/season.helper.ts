import type { Moment } from 'moment';

import { getDateInTimezone, getNow } from '@reelscore-sdk/helpers';
import type { CompetitionId, CompetitionSeason } from '@reelscore-sdk/models';

import {
  FIXED_SEASON_BY_COMPETITION,
  SEASON_START,
} from '../constants/season.data';

import { isCompetitionSeason } from './competition.helper';

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

const getRegularCompetitionSeason = (date: Moment): CompetitionSeason => {
  const startOfNextSeason = SEASON_START(date);
  const season = date.isBefore(startOfNextSeason, 'day')
    ? date.year() - 1
    : date.year();

  if (!isCompetitionSeason(season)) {
    throw new Error(`Unsupported competition season: ${season}`);
  }

  return season;
};
