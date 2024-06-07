import express from 'express';

import { getFixtureStatisticsById } from '../controllers';

export const fixturesStatistics = express.Router();

fixturesStatistics.get('/get', async (req, res) => {
  await getFixtureStatisticsById(req, res, (docs) => {
    return res.json(docs);
  });
});
