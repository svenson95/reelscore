import type { Request, Response } from 'express';
import express from 'express';

import type { CompetitionId } from '@reelscore-sdk/models';

import { getWeekDatesArray } from '../date.helper';

import { StandingsController } from './standings.controller';

export const standings = express.Router();

standings.get('/standings-by-id', async (req, res) => {
  const queryDate = req.query.date;
  if (typeof queryDate !== 'string') {
    return res.status(400).json({
      message: 'Invalid date query parameter',
    });
  }

  const standingsController = new StandingsController();
  const competitionId: CompetitionId = Number(req.query.competition);
  const doc = await standingsController.getByCompetitionAndDate(
    competitionId,
    queryDate
  );
  return res.json(doc);
});

standings.get(
  '/start-top-five',
  async (req: Request, res: Response): Promise<Response> => {
    const date = req.query.date;
    if (typeof date !== 'string') {
      return res.status(400).json({
        message: 'Invalid date query parameter',
      });
    }

    const withEdgeDays = req.query.withEdgeDays === 'true';
    const standingsController = new StandingsController();
    const weekDates = getWeekDatesArray(date, withEdgeDays);
    const weekData = await Promise.all(
      weekDates.map((day) => standingsController.getTopFive(day))
    );
    return res.json(weekData);
  }
);

standings.get('/match-standings', async (req, res) => {
  const teamIds = req.query.teamIds;
  const date = req.query.date;
  if (typeof teamIds !== 'string' || typeof date !== 'string') {
    return res.status(400).json({
      message: 'Invalid query parameters',
    });
  }

  const standingsController = new StandingsController();
  const competitionId = Number(req.query.competition);
  const doc = await standingsController.getFixtureStandings(
    teamIds,
    competitionId,
    date
  );
  return res.json(doc);
});
