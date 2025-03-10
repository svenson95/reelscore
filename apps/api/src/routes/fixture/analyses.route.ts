import express from 'express';

import { FixtureId } from '@lib/models';

import { FixtureAnalysesController } from '../../controllers';

export const fixtureAnalyses = express.Router();

fixtureAnalyses.get('', async (req, res) => {
  const fixtureId: FixtureId = String(req.query.fixture);
  const Controller = new FixtureAnalysesController();
  const analyses = await Controller.getAnalyses(fixtureId);
  return res.json(analyses);
});
