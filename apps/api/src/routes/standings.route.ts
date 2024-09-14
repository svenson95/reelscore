import express from 'express';

import {
  getFixtureStandings,
  getStandings,
  getTopFiveStandings,
} from '../controllers';

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

standings.get('/get-fixture', async (req, res) => {
  const teamIds = req.query.teamIds as string; // comma separated team ids
  const competitionId = Number(req.query.competition);
  const doc = await getFixtureStandings(teamIds, competitionId);
  res.json(doc);
});
