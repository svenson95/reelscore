import express from 'express';

import {
  getFixturesByDate,
  getFixturesById,
  getFixturesForCompetition,
  getLatestFixtures,
} from '../controllers';

export const fixtures = express.Router();

fixtures.get('/by-id', async (req, res) => {
  const fixtureId = String(req.query.fixture);
  const docs = await getFixturesById(fixtureId);
  return res.json(docs);
});

fixtures.get('/by-date', async (req, res) => {
  const date = String(req.query.date);
  const docs = await getFixturesByDate(date);
  return res.json(docs);
});

fixtures.get('/match-latest', async (req, res) => {
  const fixtureId = String(req.query.fixture);
  const docs = await getLatestFixtures(fixtureId);
  res.json(docs);
});

fixtures.get('/competition-last', async (req, res) => {
  const id = Number(req.query.competition);
  const showAll = req.query.showAll === 'true';
  const docs = await getFixturesForCompetition(id, 'last', showAll);
  res.json(docs);
});

fixtures.get('/competition-next', async (req, res) => {
  const id = Number(req.query.competition);
  const showAll = req.query.showAll === 'true';
  const docs = await getFixturesForCompetition(id, 'next', showAll);
  res.json(docs);
});
