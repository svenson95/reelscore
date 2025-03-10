import mongoose from 'mongoose';

import { FixtureId, RapidStatisticsDTO } from '@lib/models';

import { findDocument } from '../../middleware';
import { FixturesStatistics } from '../../models';

export class FixtureStatisticsService {
  async findById(
    fixtureId: FixtureId
  ): Promise<mongoose.FlattenMaps<RapidStatisticsDTO>> {
    const statistics = await findDocument(
      FixturesStatistics,
      'parameters.fixture',
      fixtureId
    );
    return statistics;
  }
}
