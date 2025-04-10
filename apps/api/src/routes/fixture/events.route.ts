import express, { Request, Response } from 'express';

import { FixtureIdParameter } from '@lib/models';

import { FixtureEventsController } from '../../controllers';

export const fixtureEvents = express.Router();

fixtureEvents.get('', async (req: Request, res: Response) => {
  const fixture = req.query.fixture;
  if (typeof fixture !== 'string') return;
  const fixtureId: FixtureIdParameter = fixture;
  const Controller = new FixtureEventsController();
  const events = await Controller.getById(fixtureId);
  return res.json(events);
});
