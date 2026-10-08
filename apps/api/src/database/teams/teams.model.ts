import type { TeamDTO } from '@reelscore-sdk/models';

import { customModel } from '../mongodb.helper';

export const Teams = customModel<TeamDTO>(
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
