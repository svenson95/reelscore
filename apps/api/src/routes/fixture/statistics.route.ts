import express from 'express';

import { getFixtureStatisticsById } from '../../controllers';

export const fixturesStatistics = express.Router();

fixturesStatistics.get('', async (req, res) => {
  await getFixtureStatisticsById(req, res, (docs) => {
    res.json(docs);
  });
});
