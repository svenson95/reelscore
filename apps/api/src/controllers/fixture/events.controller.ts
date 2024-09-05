import { EventDTO } from '@lib/models';
import { findDocument } from '../../middleware';
import { FixtureEvents } from '../../models';

export const getFixtureEventsById = async (req, res, next) => {
  const fixtureId = req.query.fixtureId;
  const doc = await findDocument(
    FixtureEvents,
    'parameters.fixture',
    fixtureId
  );

  if (!doc || typeof doc === 'string') {
    next(doc);
  } else {
    next({ ...doc, response: sortEvents(doc.response) });
  }
};

const time = (e: EventDTO) => e.time.elapsed + (e.time.extra ?? 0);
const sortEvents = (d: EventDTO[]) => d.sort((a, b) => time(b) - time(a));
