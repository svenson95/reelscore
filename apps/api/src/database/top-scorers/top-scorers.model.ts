import type { TopScorersDTO } from '@reelscore-sdk/models';

import { createMongooseModel } from '../mongodb.helper';

export const TopScorers = createMongooseModel<TopScorersDTO>(
  'competition-top-scorers',
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
