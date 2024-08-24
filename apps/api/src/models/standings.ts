import mongoose from 'mongoose';

import { StandingsDTO } from '@lib/models';

const StandingsSchema = new mongoose.Schema<StandingsDTO>(
  {
    league: {
      id: Number,
      name: String,
      country: String,
      logo: String,
      flag: String,
      season: Number,
      round: String,
      standings: [
        [
          {
            rank: Number,
            team: {
              id: Number,
              name: String,
              logo: String,
            },
            points: Number,
            goalsDiff: Number,
            group: String,
            form: String,
            status: String,
            description: String,
            all: {
              played: Number,
              win: Number,
              draw: Number,
              lose: Number,
            },
            home: {
              played: Number,
              win: Number,
              draw: Number,
              lose: Number,
            },
            away: {
              played: Number,
              win: Number,
              draw: Number,
              lose: Number,
            },
            update: String,
          },
        ],
      ],
    },
  },
  { timestamps: true }
);

export const Standings = mongoose.model('standings', StandingsSchema);
