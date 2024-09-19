import { FixtureDTO, LatestFixturesDTO } from '@lib/models';
import { Fixtures } from '../../models';

export const getLatestFixtures = async (
  fixtureId: string
): Promise<LatestFixturesDTO> => {
  const fixture = await Fixtures.findOne({
    'fixture.id': fixtureId,
  }).lean();

  const home = await findLatestFixtures(fixture, 'home');
  const away = await findLatestFixtures(fixture, 'away');

  return { home, away };
};

export const findLatestFixtures = async (
  fixture: FixtureDTO,
  team: 'home' | 'away'
): Promise<FixtureDTO[]> => {
  const teamId = fixture.teams[team].id;
  const date = fixture.fixture.date;

  return await Fixtures.find()
    .where('fixture.date')
    .lt(Number(date))
    .or([{ 'teams.home.id': teamId }, { 'teams.away.id': teamId }])
    .limit(5)
    .sort({ 'fixture.date': -1 })
    .lean();
};
