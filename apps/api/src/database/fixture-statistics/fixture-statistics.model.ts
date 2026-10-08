import type { RapidStatisticsDTO } from '@reelscore-sdk/models';

import { createMongooseModel } from '../mongodb.helper';

export const FixturesStatistics = createMongooseModel<RapidStatisticsDTO>(
  'fixtures-statistics',
  {
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
  },
  { timestamps: false }
);
