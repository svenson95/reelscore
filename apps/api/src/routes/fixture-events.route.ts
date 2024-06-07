import express from 'express';

import { getFixtureEventsById } from '../controllers';

export const fixtureEvents = express.Router();

fixtureEvents.get('/get', async (req, res) => {
  await getFixtureEventsById(req, res, (docs) => res.json(docs));
});
