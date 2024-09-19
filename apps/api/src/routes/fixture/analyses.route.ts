import express from 'express';

import { getFixtureAnalyses } from '../../controllers';

export const fixtureAnalyses = express.Router();

fixtureAnalyses.get('', async (req, res) => {
  const fixtureId = req.query.fixture;
  const data = await getFixtureAnalyses(fixtureId);
  res.json(data);
});
