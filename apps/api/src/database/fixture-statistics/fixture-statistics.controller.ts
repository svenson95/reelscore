import type {
  FixtureIdParameter,
  RapidStatisticsDTO,
} from '@reelscore-sdk/models';

import { findDocument } from '../mongodb.helper';

import { FixturesStatistics } from './fixture-statistics.model';

export class FixtureStatisticsController {
  async getById(
    fixtureId: FixtureIdParameter
  ): Promise<RapidStatisticsDTO | null> {
    const statistics = await findDocument(FixturesStatistics, {
      'parameters.fixture': fixtureId,
    });
    return statistics;
  }
}
