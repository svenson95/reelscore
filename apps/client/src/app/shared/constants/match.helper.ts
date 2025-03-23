import { FixtureDTO } from '@lib/models';
import { SELECT_COMPETITION_DATA_FLAT } from './select-league.constant';

export const linkToMatch = (data: FixtureDTO): string[] => {
  const leagueUrl = SELECT_COMPETITION_DATA_FLAT.find(
    (c) => c.id === data.league.id
  )?.url;
  if (!leagueUrl) throw new Error('Error in linkToMatch');
  const fixtureId = String(data.fixture.id);
  const date = data.fixture.date.split('T')[0];
  return ['/', date, leagueUrl, fixtureId];
};
