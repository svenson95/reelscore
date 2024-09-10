import express from 'express';

import {
  getFixturesByDate,
  getFixturesById,
  getFixturesByRound,
  getFixturesByTeamId,
  getFixturesForCompetition,
  getLatestFixtures,
} from '../controllers';

export const fixtures = express.Router();

fixtures.get('/get', async (req, res) => {
  const { fixtureId, teamId, round, date } = req.query;

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
  const { fixtureId } = req.query;
  await getLatestFixtures(fixtureId, (docs) => {
    res.json(docs);
  });
});

fixtures.get('/get-last', async (req, res) => {
  const competitionId = Number(req.query.competition);
  await getFixturesForCompetition(competitionId, 'last', (docs) => {
    res.json(docs);
  });
});

fixtures.get('/get-next', async (req, res) => {
  const competitionId = Number(req.query.competition);
  await getFixturesForCompetition(competitionId, 'next', (docs) => {
    res.json(docs);
  });
});
