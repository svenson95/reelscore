import { formatDateToYearMonthDay } from '@reelscore-sdk/helpers';
import type { FixtureDTO } from '@reelscore-sdk/models';

import { SELECT_COMPETITION_DATA_FLAT } from './select-league.constant';

export const linkToMatch = (data: FixtureDTO): string[] => {
  const leagueUrl = SELECT_COMPETITION_DATA_FLAT.find(
    (c) => c.id === data.league.id
  )?.url;
  if (!leagueUrl) throw new Error('Error in linkToMatch');

  const fixtureId = String(data.fixture.id);
  const date = formatDateToYearMonthDay(data.fixture.date);

  return ['/', date, leagueUrl, fixtureId];
};
