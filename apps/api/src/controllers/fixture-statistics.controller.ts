import { FixturesStatistics } from '../models';

export const getFixtureStatisticsById = async (req, res, next) => {
  const fixture = req.query.fixtureId;

  try {
    const docs = await FixturesStatistics.find().where('parameters').equals({
      fixture,
    });
    if (docs.length === 0) next(null);
    next(docs[0]);
  } catch (error) {
    next({
      status: 'error happened',
      error,
    });
  }
};
