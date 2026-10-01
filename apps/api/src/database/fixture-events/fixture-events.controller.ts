import type { FixtureIdParameter } from '@reelscore-sdk/models';

import { type RapidEventsDTO, timeTotal } from '@lib/models';

import { FixtureEventsService } from './fixture-events.service';

export interface FixtureEventsReader {
  findById(fixtureId: FixtureIdParameter): Promise<RapidEventsDTO | null>;
}

const sortEventsByLatest = (events: RapidEventsDTO['response']) =>
  [...events].sort((a, b) => timeTotal(b) - timeTotal(a));

export class FixtureEventsController {
  constructor(
    private readonly eventsService: FixtureEventsReader = new FixtureEventsService()
  ) {}

  async getById(fixtureId: FixtureIdParameter): Promise<RapidEventsDTO | null> {
    const events = await this.eventsService.findById(fixtureId);

    if (!events) return events;

    return { ...events, response: sortEventsByLatest(events.response) };
  }
}
