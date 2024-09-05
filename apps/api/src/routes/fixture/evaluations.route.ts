import express from 'express';
import { getFixtureEvaluations } from '../../controllers';

export const fixtureEvaluations = express.Router();

fixtureEvaluations.get('/get', async (req, res) => {
  await getFixtureEvaluations(req, res, (docs) => {
    res.json(docs);
  });
});
