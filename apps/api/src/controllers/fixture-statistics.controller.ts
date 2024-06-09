import { FixturesStatistics } from '../models';

export const getFixtureStatisticsById = async (req, res, next) => {
  const fixture = req.query.fixtureId;

  try {
    const docs = await FixturesStatistics.find().where('parameters').equals({
      fixture,
    });
    return next(docs[0] ?? null);
  } catch (error) {
    return res.json({
      status: 'error happened',
      error,
    });
  }
};
