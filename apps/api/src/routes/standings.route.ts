import express from 'express';

import { CompetitionId } from '@lib/models';
import { StandingsController } from '../controllers';

export const standings = express.Router();

standings.get('/standings-by-id', async (req, res) => {
  const standingsController = new StandingsController();
  const competitionId: CompetitionId = Number(req.query.competition);
  const queryDate = req.query?.date ? String(req.query.date) : null;
  const doc = await standingsController.getByCompetitionAndDate(
    competitionId,
    queryDate
  );
  return res.json(doc);
});

standings.get('/start-top-five', async (req, res) => {
  const standingsController = new StandingsController();
  const date = String(req.query.date);
  const docs = await standingsController.getTopFive(date);
  return res.json(docs);
});

standings.get('/match-standings', async (req, res) => {
  const standingsController = new StandingsController();
  const teamIds = req.query.teamIds as string; // comma separated team ids
  const competitionId = Number(req.query.competition);
  const doc = await standingsController.getFixtureStandings(
    teamIds,
    competitionId
  );
  return res.json(doc);
});
