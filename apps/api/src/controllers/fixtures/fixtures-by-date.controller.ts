import { Fixtures } from '../../models';

export const getFixturesByDate = async (date: string) => {
  const day = new Date(date);
  day.setHours(0, 0, 0, 0);

  const tomorrow = new Date(day);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return await Fixtures.find()
    .where('fixture.date')
    .gte(day.getTime())
    .lt(tomorrow.getTime())
    .sort({ 'fixture.date': 1 })
    .select({
      'fixture.date': 1,
      'fixture.id': 1,
      'fixture.status': 1,
      'league.name': 1,
      'league.id': 1,
      'league.round': 1,
      goals: 1,
      teams: 1,
    })
    .lean();
};
