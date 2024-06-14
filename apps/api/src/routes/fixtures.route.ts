import express from 'express';

import {
  getFixturesByDate,
  getFixturesById,
  getFixturesByRound,
  getFixturesByTeamId,
  getLatestFixtures,
} from '../controllers';

export const fixtures = express.Router();

fixtures.get('/get', async (req, res) => {
  const fixtureId = req.query.fixtureId;
  const teamId = req.query.teamId;
  const round = req.query.round;
  const date = req.query.date;

  if (fixtureId) {
    await getFixturesById(req, res, fixtureId, (docs) => {
      res.json(docs);
    });
  }

  if (teamId) {
    await getFixturesByTeamId(req, res, teamId, (docs) => {
      res.json(docs);
    });
  }

  if (round) {
    await getFixturesByRound(req, res, round, (docs) => {
      res.json(docs);
    });
  }

  if (date && typeof date === 'string') {
    await getFixturesByDate(req, res, date, (docs) => {
      res.json(docs);
    });
  }
});

fixtures.get('/get-latest', async (req, res) => {
  await getLatestFixtures(req, res, (docs) => {
    res.json(docs);
  });
});
