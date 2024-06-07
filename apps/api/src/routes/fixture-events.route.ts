import express from 'express';

import { fetchFixtureEvents, getFixtureEventsById } from '../controllers';
import { deleteDocument } from '../middleware';
import { FixtureEvents } from '../models';

export const fixtureEvents = express.Router();

fixtureEvents.get('/get', async (req, res) => {
  await getFixtureEventsById(req, res, (docs) => res.json(docs));
});

fixtureEvents.get('/fetch', async (req, res) => {
  await fetchFixtureEvents(req, res, (docs) => res.json(docs));
});

fixtureEvents.delete('/delete', async (req, res) => {
  await deleteDocument(FixtureEvents, req, res, (docs) => {
    return res.json({
      response: 'document deleted',
      documents: docs,
    });
  });
});
