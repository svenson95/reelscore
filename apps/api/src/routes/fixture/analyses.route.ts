import express from 'express';

import { FixtureId } from '@lib/models';

import { FixtureAnalysesController } from '../../controllers';

export const fixtureAnalyses = express.Router();

fixtureAnalyses.get('', async (req, res) => {
  const fixture = req.query.fixture;
  if (typeof fixture !== 'string') return;
  const fixtureId: FixtureId = Number(fixture);
  const Controller = new FixtureAnalysesController();
  const analyses = await Controller.getAnalyses(fixtureId);
  return res.json(analyses);
});
