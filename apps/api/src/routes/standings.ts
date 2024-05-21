import express from 'express';

import { fetchFromRapidApi } from '../middleware';
import { Standings } from '../models';

export const standings = express.Router();

standings.get('/get', (req, res) => {
  const leagueId = req.query.league;
  const season = 2023;

  Standings.find({ 'league.id': leagueId, 'league.season': season })
    .then((docs) => res.json(docs[docs.length - 1]))
    .catch((error) =>
      res.json({
        status: 'error happened',
        error: error,
      })
    );
});

standings.get('/get-all', (req, res) => {
  Standings.find()
    .then((docs) => res.json(docs))
    .catch((error) =>
      res.json({
        status: 'error happened',
        error: error,
      })
    );
});

standings.get('/fetch', async (req, res) => {
  const leagueId = req.query.league;

  const uri = `standings?season=2023&league=${leagueId}`;
  const response = await fetchFromRapidApi(uri);
  const body = (await response.json()) as any; // TODO fix any
  const data = body.response[0];

  const standing = new Standings(data);
  await standing
    .save()
    .then((document) => {
      res.json({
        response: 'document saved',
        document: document,
      });
    })
    .catch((error) => {
      res.json({
        response: 'error happened',
        error: error,
      });
    });
});
