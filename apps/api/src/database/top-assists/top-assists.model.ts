import mongoose from 'mongoose';

import type { TopAssistsDTO } from '@reelscore-sdk/models';

const TopAssistsSchema = new mongoose.Schema<TopAssistsDTO>(
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

export const TopAssists = mongoose.model(
  'competition-top-assists',
  TopAssistsSchema
);
