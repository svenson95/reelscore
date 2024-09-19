import { EventDTO, EventTime } from '@lib/models';
import { FixtureEvents, Fixtures } from '../../models';

export const getFixturesById = async (fixtureId: string) => {
  const data = await Fixtures.findOne({ 'fixture.id': fixtureId }).lean();
  const eventsDoc = await FixtureEvents.findOne({
    'parameters.fixture': fixtureId,
  }).lean();
  const highlights = getFixtureHighlights(eventsDoc?.response);
  return { data, highlights };
};

const getFixtureHighlights = (events: EventDTO[] | undefined) => {
  if (!events) return [];
  const goals = events.filter(
    (event) => event.type === 'Goal' && event.detail !== 'Missed Penalty'
  );
  const redCards = events.filter(
    (event) => event.type === 'Card' && event.detail === 'Red Card'
  );
  return [...goals, ...redCards].sort((a, b) => {
    const time = (t: EventTime) => t.elapsed + (t.extra ?? 0);
    return time(a.time) - time(b.time);
  });
};
