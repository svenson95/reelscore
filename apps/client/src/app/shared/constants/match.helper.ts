import type { FixtureDTO } from '@lib/models';

import { SELECT_COMPETITION_DATA_FLAT } from './select-league.constant';

export const formatBerlinDateParam = (value: string | Date): string => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Berlin',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date(value));

  const year = parts.find((part) => part.type === 'year')?.value;
  const month = parts.find((part) => part.type === 'month')?.value;
  const day = parts.find((part) => part.type === 'day')?.value;

  if (!year || !month || !day) throw new Error('Could not format Berlin date');

  return `${year}-${month}-${day}`;
};

export const linkToMatch = (data: FixtureDTO): string[] => {
  const leagueUrl = SELECT_COMPETITION_DATA_FLAT.find(
    (c) => c.id === data.league.id
  )?.url;
  if (!leagueUrl) throw new Error('Error in linkToMatch');

  const fixtureId = String(data.fixture.id);
  const date = formatBerlinDateParam(data.fixture.date);

  return ['/', date, leagueUrl, fixtureId];
};
