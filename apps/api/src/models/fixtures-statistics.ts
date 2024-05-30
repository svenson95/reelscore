import mongoose from 'mongoose';

import { FixtureStatisticsDTO } from '@lib/models';

const FixturesStatisticsSchema = new mongoose.Schema<FixtureStatisticsDTO>({
  parameters: {
    fixture: String,
  },
  response: [
    {
      team: {
        id: Number,
        name: String,
        logo: String,
      },
      statistics: [],
    },
  ],
});

export const FixturesStatistics = mongoose.model(
  'fixtures-statistics',
  FixturesStatisticsSchema
);
