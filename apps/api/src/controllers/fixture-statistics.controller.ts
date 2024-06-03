import { fetchFromRapidApi } from '../middleware';
import { FixturesStatistics } from '../models';

export const getFixtureStatisticsById = async (req, res, next) => {
  const fixtureId = req.query.fixtureId;

  try {
    const query = {
      'parameters.fixture': fixtureId,
    };
    const docs = await FixturesStatistics.find(query);
    return next(docs[0]);
  } catch (error) {
    return res.json({
      status: 'error happened',
      error,
    });
  }
};

export const getAllFixtureStatistics = async (req, res, next) => {
  try {
    const docs = await FixturesStatistics.find();
    return next(docs);
  } catch (error) {
    return res.json({
      status: 'error happened',
      error,
    });
  }
};

export const getAllFixtureStatisticsCount = async (req, res) => {
  try {
    const length = await FixturesStatistics.countDocuments();
    return res.json(length);
  } catch (error) {
    return res.json({
      status: 'error happened',
      error,
    });
  }
};

export const fetchFixtureStatistics = async (req, res, next) => {
  try {
    const fixtureId = req.query.fixtureId;
    const uri = `fixtures/statistics?fixture=${fixtureId}`;

    const response = await fetchFromRapidApi(uri);
    const body = await response.json();

    const docs = await new FixturesStatistics({
      parameters: body.parameters,
      response: body.response,
    }).save();
    return next(docs);
  } catch (error) {
    return res.json({
      status: 'error happened',
      error,
    });
  }
};
