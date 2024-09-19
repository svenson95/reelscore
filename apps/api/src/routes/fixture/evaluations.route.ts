import express from 'express';

import { getFixtureEvaluations } from '../../controllers';

export const fixtureEvaluations = express.Router();

fixtureEvaluations.get('', async (req, res) => {
  await getFixtureEvaluations(req, res, (docs) => {
    res.json(docs);
  });
});
