import type { TeamDTO } from '@reelscore-sdk/models';

import { createMongooseModel } from '../mongodb.helper';

export const Teams = createMongooseModel<TeamDTO>(
  'teams',
  {
    team: {
      id: Number,
      name: String,
      code: String,
      country: String,
      founded: Number,
      national: Boolean,
      logo: String,
    },
    venue: {
      id: Number,
      name: String,
      address: String,
      city: String,
      capacity: Number,
      surface: String,
      image: String,
    },
  },
  { timestamps: true }
);
