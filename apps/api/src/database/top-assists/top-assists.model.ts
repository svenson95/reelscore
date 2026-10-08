import type { TopAssistsDTO } from '@reelscore-sdk/models';

import { createMongooseModel } from '../mongodb.helper';

export const TopAssists = createMongooseModel<TopAssistsDTO>(
  'competition-top-assists',
  {
    parameters: {
      league: String,
      season: String,
    },
    response: [
      {
        player: {
          id: Number,
          name: String,
          firstname: String,
          lastname: String,
          age: Number,
          birth: {
            date: String,
            place: String,
            country: String,
          },
          nationality: String,
          height: String,
          weight: String,
          injured: Boolean,
          photo: String,
        },
        statistics: [],
      },
    ],
  },
  { timestamps: true }
);
