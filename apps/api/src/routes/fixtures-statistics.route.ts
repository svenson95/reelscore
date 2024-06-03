import express from 'express';

import {
  fetchFixtureStatistics,
  getAllFixtureStatistics,
  getAllFixtureStatisticsCount,
  getFixtureStatisticsById,
} from '../controllers';

export const fixturesStatistics = express.Router();

fixturesStatistics.get('/get', async (req, res) => {
  await getFixtureStatisticsById(req, res, (docs) => {
    return res.json(docs);
  });
});

fixturesStatistics.get('/get-all', async (req, res) => {
  await getAllFixtureStatistics(req, res, (docs) => {
    return res.json(docs);
  });
});

fixturesStatistics.get('/count', async (req, res) => {
  await getAllFixtureStatisticsCount(req, res);
});

fixturesStatistics.get('/fetch', async (req, res) => {
  await fetchFixtureStatistics(req, res, (docs) => {
    return res.json({
      response: 'documents saved',
      documents: docs,
    });
  });
});
