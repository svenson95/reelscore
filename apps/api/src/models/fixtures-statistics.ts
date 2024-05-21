import mongoose from 'mongoose';

const FixturesStatisticsSchema = new mongoose.Schema({
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
