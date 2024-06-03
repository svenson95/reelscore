import express from 'express';

import {
  fetchStandings,
  getAllStandings,
  getAllStandingsCount,
  getStandings,
} from '../controllers';

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

standings.get('/count', async (req, res) => {
  await getAllStandingsCount(req, res);
});

standings.get('/fetch', async (req, res) => {
  await fetchStandings(req, res, (docs) => {
    return res.json({
      response: 'document saved',
      document: docs,
    });
  });
});
