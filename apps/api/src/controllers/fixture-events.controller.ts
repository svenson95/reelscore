import { FixtureEventsResponse } from '@lib/models';
import { FixtureEvents } from '../models';

export const getFixtureEventsById = async (req, res, next) => {
  const fixture = req.query.fixtureId;
  try {
    const docs = await FixtureEvents.find().where('parameters').equals({
      fixture,
    });

    if (docs.length === 0) next(null);
    return next({ ...docs[0], response: sortEvents(docs[0].response) });
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
