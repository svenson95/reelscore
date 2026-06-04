import type { Request, Response } from 'express';
import express from 'express';

import type { CompetitionId } from '@lib/models';

import { StandingsController } from '../controllers';
import { getWeekDatesArray } from '../middleware';

export const standings = express.Router();

standings.get('/standings-by-id', async (req, res) => {
  const standingsController = new StandingsController();
  const competitionId: CompetitionId = Number(req.query.competition);
  const queryDate = String(req.query.date);
  const doc = await standingsController.getByCompetitionAndDate(
    competitionId,
    queryDate
  );
  return res.json(doc);
});

standings.get(
  '/start-top-five',
  async (req: Request, res: Response): Promise<Response> => {
    const date = String(req.query.date);
    const standingsController = new StandingsController();
    const weekDates = getWeekDatesArray(date);
    const weekData = await Promise.all(
      weekDates.map((day) => standingsController.getTopFive(day))
    );
    return res.json(weekData);
  }
);

standings.get('/match-standings', async (req, res) => {
  const standingsController = new StandingsController();
  const teamIds = String(req.query.teamIds); // comma separated team ids
  const competitionId = Number(req.query.competition);
  const date = String(req.query.date);
  const doc = await standingsController.getFixtureStandings(
    teamIds,
    competitionId,
    date
  );
  return res.json(doc);
});
