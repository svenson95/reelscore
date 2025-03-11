import mongoose from 'mongoose';

import { ExtendedFixtureDTO } from '@lib/models';

const fixturesSchema = new mongoose.Schema<ExtendedFixtureDTO>({
  final: {
    firstLegResult: {
      type: {
        home: Number,
        away: Number,
      },
      default: null,
    },
    winnerOfFinal: { type: Number, default: null },
  },
  fixture: {
    id: Number,
    referee: String,
    timezone: String,
    date: Date,
    timestamp: Number,
    periods: {
      first: Number,
      second: Number,
    },
    venue: {
      id: Number,
      name: String,
      city: String,
    },
    status: {
      long: String,
      short: String,
      elapsed: Number,
    },
  },
  league: {
    id: Number,
    name: String,
    country: String,
    logo: String,
    flag: String,
    season: Number,
    round: String,
  },
  teams: {
    home: {
      id: Number,
      name: String,
      logo: String,
      winner: Boolean,
    },
    away: {
      id: Number,
      name: String,
      logo: String,
      winner: Boolean,
    },
  },
  goals: {
    home: Number,
    away: Number,
  },
  score: {
    halftime: {
      home: Number,
      away: Number,
    },
    fulltime: {
      home: Number,
      away: Number,
    },
    extratime: {
      home: Number,
      away: Number,
    },
    penalty: {
      home: Number,
      away: Number,
    },
  },
  prediction: {
    bet: String,
    qoute: Number,
    presumption: Number,
    correct: Boolean,
  },
  evaluation: {
    home: {
      performance: String,
      analyses: [
        {
          level: String,
          minute: Number,
          type: String,
          playerId: String,
          comments: String,
        },
      ],
    },
    away: {
      performance: String,
      analyses: [
        {
          level: String,
          minute: Number,
          type: String,
          playerId: String,
          comments: String,
        },
      ],
    },
  },
});

export const Fixtures = mongoose.model('fixtures', fixturesSchema);
