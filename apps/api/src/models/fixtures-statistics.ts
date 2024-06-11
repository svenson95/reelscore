import { RapidStatisticsDTO } from '@lib/models';
import mongoose from 'mongoose';

const StatisticsSchema = new mongoose.Schema<RapidStatisticsDTO>({
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
