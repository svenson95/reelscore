import express from 'express';
import { getFixtureMetrics } from '../../controllers';

export const fixtureMetrics = express.Router();

fixtureMetrics.get('/get', async (req, res) => {
  const fixtureId = req.query.fixture;
  const data = await getFixtureMetrics(fixtureId);
  res.json(data);
});
