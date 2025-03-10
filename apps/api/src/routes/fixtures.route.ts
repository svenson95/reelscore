import express from 'express';
import { FlattenMaps } from 'mongoose';

import {
  CompetitionId,
  FixtureDateString,
  FixtureDTO,
  FixtureId,
} from '@lib/models';

import { FixtureController, FixturesController } from '../controllers';

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

fixtures.get('/by-date', async (req, res) => {
  const date: FixtureDateString = String(req.query.date);
  const fixturesController = new FixturesController();
  const fixture = await fixturesController.getByDate(date);
  return res.json(fixture);
});

fixtures.get('/competition-last', async (req, res) => {
  const docs = await competitionFixtures('last', req);
  return res.json(docs);
});

fixtures.get('/competition-next', async (req, res) => {
  const docs = await competitionFixtures('next', req);
  return res.json(docs);
});

async function competitionFixtures(
  type: 'last' | 'next',
  req: express.Request
): Promise<FlattenMaps<FixtureDTO[]>[]> {
  const id: CompetitionId = Number(req.query.competition);
  const showAll = req.query.showAll === 'true';
  const fixturesController = new FixturesController();
  const fixtures = await fixturesController.getCompetitionFixtures(
    id,
    type,
    showAll
  );
  return fixtures;
}
