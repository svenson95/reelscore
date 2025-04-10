import express, { Request, Response } from 'express';

import { FixtureId } from '@lib/models';

import { FixtureEvaluationsController } from '../../controllers';

export const fixtureEvaluations = express.Router();

fixtureEvaluations.get('', async (req: Request, res: Response) => {
  const fixture = req.query.fixture;
  if (typeof fixture !== 'string') return;
  const fixtureId: FixtureId = Number(req.query.fixture);
  const Controller = new FixtureEvaluationsController();
  const evaluations = await Controller.getEvaluations(fixtureId);
  return res.json(evaluations);
});
