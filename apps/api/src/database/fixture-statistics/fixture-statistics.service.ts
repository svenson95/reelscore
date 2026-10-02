import type {
  FixtureIdParameter,
  RapidStatisticsDTO,
} from '@reelscore-sdk/models';

import { findDocument } from '../mongodb.helper';

import { FixturesStatistics } from './fixture-statistics.model';

export class FixtureStatisticsService {
  async findById(
    fixtureId: FixtureIdParameter
  ): Promise<RapidStatisticsDTO | null> {
    const statistics = await findDocument(FixturesStatistics, fixtureId);
    return statistics;
  }
}
