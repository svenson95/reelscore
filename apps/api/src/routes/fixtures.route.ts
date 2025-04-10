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
  const fixture = req.query.fixture;
  if (typeof fixture !== 'string') return;
  const fixtureId: FixtureId = Number(fixture);
  const fixtureController = new FixtureController();
  const fixtureWithHighlights = await fixtureController.getByIdWithHighlights(
    fixtureId
  );
  return res.json(fixtureWithHighlights);
});

fixtures.get('/match-latest', async (req, res) => {
  const fixture = req.query.fixture;
  if (typeof fixture !== 'string') return;
  const fixtureId: FixtureId = Number(fixture);
  const fixtureController = new FixtureController();
  const latestFixtures = await fixtureController.getLatest(fixtureId);
  return res.json(latestFixtures);
});

fixtures.get(
  '/by-date',
  async (req: Request, res: Response): Promise<Response> => {
    const date = String(req.query.date);
    const fixturesController = new FixturesController();
    const weekDates = getWeekDatesArray(date);
    const weekFixtures = await Promise.all(
      weekDates.map((day) => fixturesController.getByDate(day))
    );

    return res.json(weekFixtures);
  }
);

fixtures.get('/competition-fixtures', async (req: Request, res: Response) => {
  const id: CompetitionId = Number(req.query.competition);
  const type: CompetitionRequestType = req.query.type as CompetitionRequestType;
  const showAll = req.query.showAll === 'true';

  const docs = await competitionFixtures(type, id, showAll);
  return res.json(docs);
});
