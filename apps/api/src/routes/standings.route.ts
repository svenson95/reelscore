import express from 'express';

import {
  fetchStandings,
  getAllStandings,
  getAllStandingsCount,
  getStanding,
  getTopFiveStandings,
} from '../controllers';

export const standings = express.Router();

standings.get('/get', async (req, res) => {
  await getStanding(req, res, (docs) => {
    return res.json(docs);
  });
});

standings.get('/get-top-five', async (req, res) => {
  await getTopFiveStandings(req, res, (docs) => {
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
