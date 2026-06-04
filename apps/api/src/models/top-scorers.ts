import mongoose from 'mongoose';

import type { TopScorersDTO } from '@lib/models';

const TopScorersSchema = new mongoose.Schema<TopScorersDTO>(
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

export const TopScorers = mongoose.model(
  'competition-top-scorers',
  TopScorersSchema
);
