import type { StandingsDTO } from '@reelscore-sdk/models';

import { customModel } from '../mongodb.helper';

export const Standings = customModel<StandingsDTO>(
  'standings',
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
              goals: {
                for: Number,
                against: Number,
              },
            },
            home: {
              played: Number,
              win: Number,
              draw: Number,
              lose: Number,
              goals: {
                for: Number,
                against: Number,
              },
            },
            away: {
              played: Number,
              win: Number,
              draw: Number,
              lose: Number,
              goals: {
                for: Number,
                against: Number,
              },
            },
            update: String,
          },
        ],
      ],
    },
  },
  { timestamps: true }
);
