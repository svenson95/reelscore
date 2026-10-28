import type { NextFunction, Request, Response } from 'express';
import express from 'express';

import type { CompetitionId, FixtureId } from '@reelscore-sdk/models';

import { getWeekDatesArray } from '../date.helper';

import { FixtureController } from './fixture.controller';
import type { CompetitionRequestType } from './fixtures.controller';
import { FixturesController } from './fixtures.controller';

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
  '/head-to-head',
  async (req: Request, res: Response, next: NextFunction) => {
    const fixture = req.query.fixture;
    const parsedFixtureId =
      typeof fixture === 'string' ? Number(fixture) : Number.NaN;
    if (!Number.isSafeInteger(parsedFixtureId) || parsedFixtureId <= 0) {
      return res.status(400).json({
        message: 'Invalid fixture query parameter',
      });
    }

    try {
      const fixtureId: FixtureId = parsedFixtureId;
      const fixtureController = new FixtureController();
      const headToHeadFixtures = await fixtureController.getHeadToHead(
        fixtureId
      );
      return res.json(headToHeadFixtures);
    } catch (error) {
      return next(error);
    }
  }
);

fixtures.get(
  '/by-date',
  async (req: Request, res: Response): Promise<Response> => {
    const date = req.query.date;
    if (typeof date !== 'string') {
      return res.status(400).json({
        message: 'Invalid date query parameter',
      });
    }

    const withEdgeDays = req.query.withEdgeDays === 'true';

    const dates = getWeekDatesArray(date, withEdgeDays);

    const fixturesController = new FixturesController();

    const weekFixtures = await Promise.all(
      dates.map((day) => fixturesController.getByDate(day))
    );

    return res.json(weekFixtures);
  }
);

fixtures.get('/competition-fixtures', async (req: Request, res: Response) => {
  const id: CompetitionId = Number(req.query.competition);
  const type: CompetitionRequestType = req.query.type as CompetitionRequestType;
  const showAll = req.query.showAll === 'true';

  const fixturesController = new FixturesController();
  const docs = await fixturesController.competitionFixtures(type, id, showAll);
  return res.json(docs);
});
