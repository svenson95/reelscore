import type { FixtureIdParameter, RapidStatisticsDTO } from '@lib/models';

import { findDocument } from '../../helper';
import { FixturesStatistics } from '../../models';

export class FixtureStatisticsController {
  async getById(fixtureId: FixtureIdParameter): Promise<RapidStatisticsDTO> {
    const statistics = await findDocument(
      FixturesStatistics,
      'parameters.fixture',
      fixtureId
    );
    return statistics;
  }
}
