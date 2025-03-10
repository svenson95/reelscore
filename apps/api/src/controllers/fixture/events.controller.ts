import { EventDTO, FixtureId, RapidEventsDTO } from '@lib/models';
import { FlattenMaps } from 'mongoose';
import { FixtureEventsService } from '../../services';

const time = (e: EventDTO) => e.time.elapsed + (e.time.extra ?? 0);
const sortEvents = (d: EventDTO[]) => d.sort((a, b) => time(b) - time(a));

export class FixtureEventsController {
  private eventsService = new FixtureEventsService();

  async getById(fixtureId: FixtureId): Promise<FlattenMaps<RapidEventsDTO>> {
    const events = await this.eventsService.findById(fixtureId);

    if (!events || typeof events === 'string') {
      return events;
    } else {
      return { ...events, response: sortEvents(events.response) };
    }
  }
}
