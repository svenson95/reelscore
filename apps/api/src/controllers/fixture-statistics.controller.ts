import { FixturesStatistics } from '../models';

export const getFixtureStatisticsById = async (req, res, next) => {
  const fixtureId = req.query.fixtureId;

  try {
    const query = {
      'parameters.fixture': fixtureId,
    };
    const docs = await FixturesStatistics.find(query);
    return next(docs[0]);
  } catch (error) {
    return res.json({
      status: 'error happened',
      error,
    });
  }
};
