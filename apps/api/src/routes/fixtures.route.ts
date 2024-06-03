import express from 'express';

import {
  deleteFixture,
  fetchFixtures,
  getAllFixtures,
  getAllFixturesCount,
  getFixturesByDate,
  getFixturesById,
  getFixturesByRound,
  getFixturesByTeamId,
  updateFixture,
} from '../controllers';

export const fixtures = express.Router();

fixtures.get('/get', async (req, res) => {
  const fixtureId = req.query.fixtureId;
  const teamId = req.query.teamId;
  const round = req.query.round;
  const date = req.query.date;

  if (fixtureId) {
    await getFixturesById(req, res, fixtureId);
  }

  if (teamId) {
    await getFixturesByTeamId(req, res, teamId);
  }

  if (round) {
    await getFixturesByRound(req, res, round);
  }

  if (date && typeof date === 'string') {
    await getFixturesByDate(req, res, date);
  }
});

fixtures.get('/get-all', async (req, res) => {
  await getAllFixtures(req, res);
});

fixtures.get('/count', async (req, res) => {
  await getAllFixturesCount(req, res);
});

fixtures.get('/fetch', async (req, res) => {
  await fetchFixtures(req, res);
});

fixtures.patch('/update', async (req, res) => {
  await updateFixture(req, res);
});

fixtures.delete('/delete', async (req, res) => {
  await deleteFixture(req, res);
});
