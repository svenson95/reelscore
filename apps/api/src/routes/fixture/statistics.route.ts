import express, { Request, Response } from 'express';

import { FixtureId } from '@lib/models';

import { FixtureStatisticsController } from '../../controllers';

export const fixturesStatistics = express.Router();

fixturesStatistics.get('', async (req: Request, res: Response) => {
  const Controller = new FixtureStatisticsController();
  const fixtureId: FixtureId = String(req.query.fixture);
  const statistics = await Controller.getById(fixtureId);
  return res.json(statistics);
});
