import express from 'express';

import { fetchFromRapidApi } from '../middleware';
import { Fixtures } from '../models';

export const fixtures = express.Router();

fixtures.get('/get', (req, res) => {
  const fixtureId = req.query.fixtureId;
  const teamId = req.query.teamId;
  const round = req.query.round ? `Regular Season - ${req.query.round}` : null;
  const leagueId = req.query.league;
  const date = req.query.date;

  if (fixtureId) {
    return Fixtures.find({ 'fixture.id': fixtureId })
      .then((docs) => res.json(docs[0]))
      .catch((error) =>
        res.json({
          status: 'error happened',
          error: error,
        })
      );
  }

  if (teamId) {
    const homeTeamId = { 'teams.home.id': teamId };
    const awayTeamId = { 'teams.away.id': teamId };
    const currentSeason = { 'league.season': 2023 };

    return Fixtures.find({
      $or: [homeTeamId, awayTeamId],
      $and: [currentSeason],
    })
      .then((docs) => res.json(docs))
      .catch((error) =>
        res.json({
          status: 'error happened',
          error: error,
        })
      );
  }

  if (round) {
    return Fixtures.find({
      'league.id': leagueId,
      'league.round': round,
      'league.season': 2023,
    })
      .then((docs) => res.json(docs))
      .catch((error) =>
        res.json({
          status: 'error happened',
          error: error,
        })
      );
  }

  if (date && typeof date === 'string') {
    const day = new Date(date);
    day.setHours(0, 0, 0, 0);

    const tomorrow = new Date(day);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return Fixtures.find({
      'fixture.date': {
        $gte: day,
        $lt: tomorrow,
      },
    })
      .sort({ 'fixture.date': 1 })
      .then((docs) => res.json(docs))
      .catch((error) =>
        res.json({
          status: 'error happened',
          error: error,
        })
      );
  }
});

fixtures.delete('/delete', async (req, res) => {
  const round = `Regular Season - 6`;
  const _id = req.query.id;

  Fixtures.deleteOne({ _id })
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

fixtures.get('/get', (req, res) => {
  const leagueId = req.query.league;
  const round = `Regular Season - ${req.query.round}`;

  Fixtures.find({
    'league.id': leagueId,
    'league.round': round,
    'league.season': 2023,
  })
    .then((docs) => res.json(docs))
    .catch((error) =>
      res.json({
        status: 'error happened',
        error: error,
      })
    );
});

fixtures.get('/get-all', (req, res) => {
  const sort = String(req.query.sort);
  const order = req.query.order;
  const page = Number(req.query.page);
  const limit = Number(req.query.limit);

  let query: string;

  if (sort === '_id') {
    query = '_id';
  } else if (sort === 'fixtureId') {
    query = 'fixture.id';
  } else if (sort === 'date') {
    query = 'fixture.date';
  } else if (sort === 'league') {
    query = 'league.name';
  } else if (sort === 'round') {
    query = 'league.round';
  } else if (sort === 'home') {
    query = 'teams.home.name';
  } else if (sort === 'away') {
    query = 'teams.away.name';
  } else if (sort === 'score') {
    query = 'score.fulltime.home';
  }

  Fixtures.countDocuments().then((length) => {
    Fixtures.find()
      .sort({ [query]: order === 'asc' ? 1 : -1 })
      .limit(limit)
      .skip(page * limit)
      .then((data) => res.json({ data, length }))
      .catch((error) =>
        res.json({
          status: 'error happened',
          error: error,
        })
      );
  });
});

fixtures.get('/fetch', async (req, res) => {
  const leagueId = req.query.league;
  const round = req.query.round;

  const uri = `fixtures?league=${leagueId}&round=Regular%20Season%20-%20${round}&season=2023`;
  const response = await fetchFromRapidApi(uri);
  const body = (await response.json()) as any; // TODO fix any
  const data = body.response;

  // await Fixtures.find().exec((error, fixtures) => {
  //   if (error) {
  //       return res.json({
  //           status: "error happened",
  //           error: error
  //       });
  //   }

  //   fixtures.forEach(fixture => {
  //     Fixtures.findOne({ 'fixture.id': fixture.id }).exec((error, fixture) => {
  //       if (error) {
  //         // TODO: create fixture
  //         Fixtures.create(fixture);
  //       } else {
  //         // TODO: update fixture
  //         Fixtures.updateOne({ 'fixture.id': fixture!.id }).exec();
  //       }
  //     });
  //   });
  // });

  await Fixtures.updateMany(data)
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

fixtures.patch('/update', async (req, res) => {
  const body = req.body;

  await Fixtures.findOneAndUpdate({ _id: body._id }, body)
    .then((document) => {
      return res.json({
        response: 'document saved',
        documents: document,
      });
    })
    .catch((error) => {
      return res.json({
        response: 'error happened',
        error: error,
      });
    });
});
