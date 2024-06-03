import express from 'express';

import { fetchStandings, getAllStandings, getStandings } from '../controllers';

export const standings = express.Router();

standings.get('/get', async (req, res) => {
  await getStandings(req, res, (docs) => {
    return res.json(docs);
  });
});

standings.get('/get-all', async (req, res) => {
  await getAllStandings(req, res, (docs) => {
    return res.json(docs);
  });
});

standings.get('/fetch', async (req, res) => {
  await fetchStandings(req, res, (docs) => {
    return res.json({
      response: 'document saved',
      document: docs,
    });
  });
});
