import type { TeamCoachDTO } from '@reelscore-sdk/models';

import { customModel } from '../mongodb.helper';

type TeamCoachesDocument = {
  parameters: {
    team: string;
  };
  response: TeamCoachDTO[];
  lastFetchedAt?: Date;
};

export const TeamCoaches = customModel<TeamCoachesDocument>(
  'team-coaches',
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
