import { fetchFromRapidApi } from '../middleware';
import { createOrUpdate } from '../middleware/mongodb';
import { FixtureEvents } from '../models';

export const getFixtureEventsById = async (req, res, next) => {
  const fixtureId = req.query.fixture;
  try {
    const docs = await FixtureEvents.find({ 'fixture.id': fixtureId });
    return next(docs[0]);
  } catch (error) {
    return res.json({
      status: 'error happened',
      error,
    });
  }
};

export const fetchFixtureEvents = async (req, res, next) => {
  try {
    const fixtureId = req.query.fixture;
    const uri = `fixtures/events?fixture=${fixtureId}`;

    const response = await fetchFromRapidApi(uri);
    const body = await response.json();

    createOrUpdate(FixtureEvents, body, (doc) => {
      next(doc);
    });
  } catch (error) {
    return res.json({
      status: 'error happened',
      error,
    });
  }
};
