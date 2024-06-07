import { FixtureEventsResponse } from '@lib/models';
import { FixtureEvents } from '../models';

export const getFixtureEventsById = async (req, res, next) => {
  const fixtureId = req.query.fixture;
  try {
    const docs = await FixtureEvents.find({ 'fixture.id': fixtureId });
    const doc = {
      ...docs[0],
      response: sortEvents(docs[0].response),
    };
    return next(doc);
  } catch (error) {
    return res.json({
      status: 'error happened',
      error,
    });
  }
};

const sortEvents = (events: FixtureEventsResponse[]) => {
  return events.sort((a, b) => b.time.elapsed - a.time.elapsed);
};
