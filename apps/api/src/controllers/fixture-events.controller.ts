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
