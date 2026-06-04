import mongoose from 'mongoose';

import type { TeamDTO } from '@lib/models';

const TeamsSchema = new mongoose.Schema<TeamDTO>(
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

export const Teams = mongoose.model('teams', TeamsSchema);
