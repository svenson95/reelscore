import { EventDTO } from '@lib/models';
import { FixtureEvents } from '../models';

export const getFixtureEventsById = async (req, res, next) => {
  const fixture = req.query.fixtureId;
  try {
    const docs = await FixtureEvents.find().where('parameters').equals({
      fixture,
    });

    if (docs.length === 0) next(null);
    next({ ...docs[0], response: sortEvents(docs[0].response) });
  } catch (error) {
    next({
      status: 'error happened',
      error,
    });
  }
};

const sortEvents = (d: EventDTO[]) => {
  const time = (t: EventDTO) => t.time.elapsed + t.time.extra;
  return d.sort((a, b) => time(b) - time(a));
};
