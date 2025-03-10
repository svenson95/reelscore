import { FixtureId } from '@lib/models';
import express, { Request, Response } from 'express';
import { FixtureEventsController } from '../../controllers';

export const fixtureEvents = express.Router();

fixtureEvents.get('', async (req: Request, res: Response) => {
  const fixtureId: FixtureId = String(req.query.fixture);
  const Controller = new FixtureEventsController();
  const events = await Controller.getById(fixtureId);
  return res.json(events);
});
