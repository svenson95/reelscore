import express from 'express';

import {
  getFixtureStandings,
  getStandings,
  getTopFiveStandings,
} from '../controllers';

export const standings = express.Router();

standings.get('/standings-by-id', async (req, res) => {
  const competitionId = Number(req.query.competition);
  const queryDate = req.query?.date ? String(req.query.date) : null;

  const docs = await getStandings(competitionId, queryDate);
  res.json(docs);
});

standings.get('/start-top-five', async (req, res) => {
  const date = String(req.query.date);
  const docs = await getTopFiveStandings(date);
  res.json(docs);
});

standings.get('/match-standings', async (req, res) => {
  const teamIds = req.query.teamIds as string; // comma separated team ids
  const competitionId = Number(req.query.competition);
  const doc = await getFixtureStandings(teamIds, competitionId);
  res.json(doc);
});
