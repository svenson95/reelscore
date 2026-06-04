import type { Request, Response } from 'express';
import express from 'express';

import type { FixtureIdParameter } from '@lib/models';

import { FixtureStatisticsController } from '../../controllers';

export const fixturesStatistics = express.Router();

fixturesStatistics.get('', async (req: Request, res: Response) => {
  const Controller = new FixtureStatisticsController();
  const fixture = req.query.fixture;
  if (typeof fixture !== 'string') return;
  const fixtureId: FixtureIdParameter = fixture;
  const statistics = await Controller.getById(fixtureId);
  return res.json(statistics);
});
