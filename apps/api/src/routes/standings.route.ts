import express from 'express';

import { getStanding, getTopFiveStandings } from '../controllers';

export const standings = express.Router();

standings.get('/get', async (req, res) => {
  await getStanding(req, res, (docs) => {
    res.json(docs);
  });
});

standings.get('/get-top-five', async (req, res) => {
  await getTopFiveStandings(req, res, (docs) => {
    res.json(docs);
  });
});
