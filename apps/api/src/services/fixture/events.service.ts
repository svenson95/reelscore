import type { EventDTO, FixtureIdParameter, RapidEventsDTO } from '@lib/models';
import { filterFixtureHighlights } from '@lib/shared';

import { findDocument } from '../../helper';
import { FixtureEvents } from '../../models';

export class FixtureEventsService {
  async findById(
    fixtureId: FixtureIdParameter
  ): Promise<RapidEventsDTO | null> {
    const events = await findDocument(
      FixtureEvents,
      'parameters.fixture',
      fixtureId
    );

    return events;
  }

  filterHighlights(events: EventDTO[] | undefined): EventDTO[] {
    return filterFixtureHighlights(events);
  }
}
