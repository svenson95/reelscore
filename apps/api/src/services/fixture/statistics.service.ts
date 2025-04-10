import mongoose from 'mongoose';

import { FixtureIdParameter, RapidStatisticsDTO } from '@lib/models';

import { findDocument } from '../../middleware';
import { FixturesStatistics } from '../../models';

export class FixtureStatisticsService {
  async findById(
    fixtureId: FixtureIdParameter
  ): Promise<mongoose.FlattenMaps<RapidStatisticsDTO>> {
    const statistics = await findDocument(
      FixturesStatistics,
      'parameters.fixture',
      fixtureId
    );
    return statistics;
  }
}
