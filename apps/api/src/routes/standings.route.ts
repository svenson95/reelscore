import express from 'express';

import { getStandings, getTopFiveStandings } from '../controllers';

export const standings = express.Router();

standings.get('/get', async (req, res) => {
  await getStandings(req, res, (docs) => {
    const result = docs.length > 0 ? docs[0] : null;
    res.json(result);
  });
});

standings.get('/get-top-five', async (req, res) => {
  await getTopFiveStandings(req, res, (docs) => {
    res.json(docs);
  });
});
