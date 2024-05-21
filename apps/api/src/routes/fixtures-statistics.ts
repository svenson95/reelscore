import express from 'express';

import { fetchFromRapidApi } from '../middleware';
import { FixturesStatistics } from '../models';

export const fixturesStatistics = express.Router();

fixturesStatistics.get('/get', (req, res) => {
  const fixtureId = req.query.fixtureId;

  FixturesStatistics.find({ 'parameters.fixture': fixtureId })
    .then((docs) => res.json(docs[0]))
    .catch((error) =>
      res.json({
        status: 'error happened',
        error: error,
      })
    );
});

fixturesStatistics.get('/get-all', (req, res) => {
  FixturesStatistics.find()
    .then((docs) => res.json(docs))
    .catch((error) =>
      res.json({
        status: 'error happened',
        error: error,
      })
    );
});

fixturesStatistics.get('/fetch', async (req, res) => {
  const fixtureId = req.query.fixtureId;

  const uri = `fixtures/statistics?fixture=${fixtureId}`;
  const response = await fetchFromRapidApi(uri);
  const body = (await response.json()) as any; // TODO fix any

  const doc = new FixturesStatistics({
    parameters: body.parameters,
    response: body.response,
  });

  await doc
    .save()
    .then((documents) => {
      return res.json({
        response: 'documents saved',
        documents: documents,
      });
    })
    .catch((error) => {
      return res.json({
        response: 'error happened',
        error: error,
      });
    });
});
