import mongoose from 'mongoose';

import { StatisticsDTO } from '@lib/models';

const StatisticsSchema = new mongoose.Schema<StatisticsDTO>({
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
  StatisticsSchema
);
