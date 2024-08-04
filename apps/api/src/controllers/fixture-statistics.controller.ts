import { findDocument } from '../middleware';
import { FixturesStatistics } from '../models';

export const getFixtureStatisticsById = async (req, res, next) => {
  const fixtureId = req.query.fixtureId;

  const docs = await findDocument(
    FixturesStatistics,
    'parameters.fixture',
    fixtureId
  );
  next(docs);
};
