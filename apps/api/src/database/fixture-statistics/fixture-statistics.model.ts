import type { RapidStatisticsDTO } from '@reelscore-sdk/models';

import { customModel } from '../mongodb.helper';

export const FixturesStatistics = customModel<RapidStatisticsDTO>(
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
