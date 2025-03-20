import express, { Request, Response } from 'express';

import { CompetitionId, FixtureId } from '@lib/models';

import {
  competitionFixtures,
  CompetitionRequestType,
  FixtureController,
  FixturesController,
} from '../controllers';
import { getWeekDatesArray } from '../middleware';

export const fixtures = express.Router();

fixtures.get('/by-id', async (req, res) => {
  const fixtureId: FixtureId = String(req.query.fixture);
  const fixtureController = new FixtureController();
  const fixture = await fixtureController.getByIdWithHighlights(fixtureId);
  return res.json(fixture);
});

fixtures.get('/match-latest', async (req, res) => {
  const fixtureId: FixtureId = String(req.query.fixture);
  const fixtureController = new FixtureController();
  const fixtures = await fixtureController.getLatest(fixtureId);
  return res.json(fixtures);
});

fixtures.get(
  '/by-date',
  async (req: Request, res: Response): Promise<Response> => {
    const date = String(req.query.date);
    const fixturesController = new FixturesController();
    const weekDates = getWeekDatesArray(date);
    const weekData = await Promise.all(
      weekDates.map((day) => fixturesController.getByDate(day))
    );

    return res.json(weekData);
  }
);

fixtures.get('/competition-fixtures', async (req: Request, res: Response) => {
  const id: CompetitionId = Number(req.query.competition);
  const type: CompetitionRequestType = req.query.type as CompetitionRequestType;
  const showAll = req.query.showAll === 'true';

  const docs = await competitionFixtures(type, id, showAll);
  return res.json(docs);
});
