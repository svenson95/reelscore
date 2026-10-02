import type {
  FixtureId,
  FixtureIdParameter,
  GetFixtureDTO,
  LatestFixturesDTO,
} from '@reelscore-sdk/models';

import { FixtureEventsService } from '../fixture-events';

import { FixtureService } from './fixture.service';
import { FixturesService } from './fixtures.service';

export class FixtureController {
  private readonly fixtureService = new FixtureService();
  private readonly fixturesService = new FixturesService();
  private readonly eventsService = new FixtureEventsService();

  async getByIdWithHighlights(fixtureId: FixtureId): Promise<GetFixtureDTO> {
    const data = await this.fixturesService.findById(fixtureId);
    const fixtureIdParameter: FixtureIdParameter = fixtureId.toString();
    const eventsDoc = await this.eventsService.findById(fixtureIdParameter);

    const highlights = this.eventsService.filterHighlights(eventsDoc?.response);
    return { data, highlights };
  }

  async getLatest(fixtureId: FixtureId): Promise<LatestFixturesDTO> {
    const fixture = await this.fixtureService.findById(fixtureId);
    if (!fixture) {
      throw new Error(`Fixture with id ${fixtureId} not found`);
    }

    const home = await this.fixturesService.findByFixtureAndTeamType(
      fixture,
      'home'
    );
    const away = await this.fixturesService.findByFixtureAndTeamType(
      fixture,
      'away'
    );

    return { home, away };
  }
}
