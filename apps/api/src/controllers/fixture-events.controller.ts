import { FixtureEventsResponse } from '@lib/models';
import { FixtureEvents } from '../models';

export const getFixtureEventsById = async (req, res, next) => {
  const fixture = req.query.fixtureId;
  try {
    const docs = await FixtureEvents.find().where('parameters').equals({
      fixture,
    });

    if (docs.length === 0) {
      return null;
    }
    const sortedEvents = sortEvents(docs[0].response);
    return next({ ...docs[0], response: sortedEvents });
  } catch (error) {
    return res.json({
      status: 'error happened',
      error,
    });
  }
};

const sortEvents = (d: FixtureEventsResponse[]) => {
  const time = (t: FixtureEventsResponse) => t.time.elapsed + t.time.extra;
  return d.sort((a, b) => time(b) - time(a));
};
