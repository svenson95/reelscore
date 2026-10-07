import mongoose from 'mongoose';

import type { TeamCoachDTO } from '@reelscore-sdk/models';

type TeamCoachesDocument = {
  parameters: {
    team: string;
  };
  response: TeamCoachDTO[];
  lastFetchedAt?: Date;
};

const TeamCoachesSchema = new mongoose.Schema<TeamCoachesDocument>(
  {
    parameters: {
      team: String,
    },
    response: [
      {
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
        photo: String,
        team: {
          id: Number,
          name: String,
          logo: String,
        },
        career: [
          {
            team: {
              id: Number,
              name: String,
              logo: String,
            },
            start: String,
            end: String,
          },
        ],
      },
    ],
    lastFetchedAt: Date,
  },
  { timestamps: true }
);

export const TeamCoaches = mongoose.model('team-coaches', TeamCoachesSchema);
