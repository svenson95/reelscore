import { fetchFromRapidApi } from '../middleware';
import { Fixtures } from '../models';

export const getFixturesById = async (req, res, fixtureId) => {
  try {
    const docs = await Fixtures.find({ 'fixture.id': fixtureId });
    return res.json(docs[0]);
  } catch (error) {
    return res.json({
      status: 'error happened',
      error,
    });
  }
};

export const getFixturesByTeamId = async (req, res, teamId) => {
  const homeTeamId = { 'teams.home.id': teamId };
  const awayTeamId = { 'teams.away.id': teamId };
  const currentSeason = { 'league.season': 2023 };

  try {
    const docs = await Fixtures.find({
      $or: [homeTeamId, awayTeamId],
      $and: [currentSeason],
    });
    return res.json(docs);
  } catch (error) {
    return res.json({
      status: 'error happened',
      error,
    });
  }
};

export const getFixturesByRound = async (req, res, round) => {
  const leagueId = req.query.league;
  const roundString = round ? `Regular Season - ${round}` : null;

  try {
    const docs = await Fixtures.find({
      'league.id': leagueId,
      'league.round': roundString,
      'league.season': 2023,
    });
    return res.json(docs);
  } catch (error) {
    return res.json({
      status: 'error happened',
      error,
    });
  }
};

export const getFixturesByDate = async (req, res, date) => {
  const day = new Date(date);
  day.setHours(0, 0, 0, 0);

  const tomorrow = new Date(day);
  tomorrow.setDate(tomorrow.getDate() + 1);

  try {
    const docs = await Fixtures.find({
      'fixture.date': {
        $gte: day,
        $lt: tomorrow,
      },
    }).sort({ 'fixture.date': 1 });
    return res.json(docs);
  } catch (error) {
    return res.json({
      status: 'error happened',
      error,
    });
  }
};

export const getAllFixtures = async (req, res) => {
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

  try {
    const length = await Fixtures.countDocuments();
    const data = await Fixtures.find()
      .sort({ [query]: order === 'asc' ? 1 : -1 })
      .limit(limit)
      .skip(page * limit);
    return res.json({ data, length });
  } catch (error) {
    return res.json({
      status: 'error happened',
      error,
    });
  }
};

export const getAllFixturesCount = async (req, res) => {
  try {
    const length = await Fixtures.countDocuments();
    return res.json(length);
  } catch (error) {
    return res.json({
      status: 'error happened',
      error,
    });
  }
};

export const fetchFixtures = async (req, res) => {
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

  try {
    const documents = await Fixtures.updateMany(data);
    return res.json({
      response: 'documents saved',
      documents,
    });
  } catch (error) {
    return res.json({
      response: 'error happened',
      error,
    });
  }
};

export const updateFixture = async (req, res) => {
  const body = req.body;

  try {
    const documents = await Fixtures.findOneAndUpdate({ _id: body._id }, body);
    return res.json({
      response: 'document saved',
      documents,
    });
  } catch (error) {
    return res.json({
      response: 'error happened',
      error,
    });
  }
};

export const deleteFixture = async (req, res) => {
  const round = `Regular Season - 6`;
  const _id = req.query.id;

  try {
    const docs = await Fixtures.deleteOne({ _id });
    res.json({
      response: 'documents saved',
      documents: docs,
    });
  } catch (error) {
    return res.json({
      response: 'error happened',
      error,
    });
  }
};
