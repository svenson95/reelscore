import type { EventDTO, FixtureIdParameter } from '@reelscore-sdk/models';

import type { RapidEventsDTO } from '@lib/models';
import { filterFixtureHighlights } from '@lib/shared';

import { findDocument } from '../mongodb.helper';

import { FixtureEvents } from './fixture-events.model';

export class FixtureEventsService {
  async findById(
    fixtureId: FixtureIdParameter
  ): Promise<RapidEventsDTO | null> {
    const events = await findDocument(FixtureEvents, {
      'parameters.fixture': fixtureId,
    });

    return events;
  }

  filterHighlights(events: EventDTO[] | undefined): EventDTO[] {
    return filterFixtureHighlights(events);
  }
}
