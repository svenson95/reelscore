import { FixtureId, GetFixtureDTO, LatestFixturesDTO } from '@lib/models';

import {
  FixtureEventsService,
  FixtureService,
  FixturesService,
} from '../../services';

export class FixtureController {
  private fixtureService = new FixtureService();
  private fixturesService = new FixturesService();
  private eventsService = new FixtureEventsService();

  async getByIdWithHighlights(fixtureId: FixtureId): Promise<GetFixtureDTO> {
    const data = await this.fixturesService.findById(fixtureId);
    const eventsDoc = await this.eventsService.findById(fixtureId);

    const highlights = this.eventsService.filterHighlights(eventsDoc?.response);
    return { data, highlights };
  }

  async getLatest(fixtureId: FixtureId): Promise<LatestFixturesDTO> {
    const fixture = await this.fixtureService.findById(fixtureId);

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
