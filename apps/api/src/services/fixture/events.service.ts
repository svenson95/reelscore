import mongoose from 'mongoose';

import { EventDTO, EventTime, FixtureId, RapidEventsDTO } from '@lib/models';

import { findDocument } from '../../middleware';
import { FixtureEvents } from '../../models';

export class FixtureEventsService {
  async findById(
    fixtureId: FixtureId
  ): Promise<mongoose.FlattenMaps<RapidEventsDTO>> {
    const events = await findDocument(
      FixtureEvents,
      'parameters.fixture',
      fixtureId
    );
    return events;
  }

  filterHighlights(events: EventDTO[] | undefined): EventDTO[] {
    if (!events) return [];
    const goals = events.filter(({ type, detail }) => {
      // TODO refactor to lib (1/2)
      const goalTypes = ['Normal Goal', 'Own Goal', 'Penalty'];
      return type === 'Goal' && goalTypes.includes(detail);
    });
    const redCards = events.filter(
      ({ type, detail }) => type === 'Card' && detail === 'Red Card'
    );
    return [...goals, ...redCards].sort((event1, event2) => {
      const time = (t: EventTime) => t.elapsed + (t.extra ?? 0);
      return time(event1.time) - time(event2.time);
    });
  }
}
