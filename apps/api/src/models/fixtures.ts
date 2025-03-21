import mongoose from 'mongoose';

import { ExtendedFixtureDTO } from '@lib/models';

const fixturesSchema = new mongoose.Schema<ExtendedFixtureDTO>({
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
  final: {
    firstLegResult: {
      home: Number,
      away: Number,
    },
    winnerOfFinal: { type: Number, default: null },
  },
  prediction: {
    bet: String,
    qoute: Number,
    probability: {
      type: Number,
      enum: [0.75, 0.8, 0.85, 0.9, 0.95],
    },
    correct: Boolean,
  },
  evaluations: {
    home: {
      performance: {
        type: String,
        enum: ['LOW', 'MIDDLE', 'HIGH'],
      },
      analyses: [
        {
          level: {
            type: String,
            enum: ['LUCKY', 'UNLUCKY'],
          },
          minute: Number,
          type: {
            type: String,
            enum: [
              'GOAL',
              'NO_GOAL',
              'LAST_MINUTE_GOAL',
              'PENALTY',
              'NO_PENALTY',
              'RED_CARD',
              'NO_RED_CARD',
              'KEY_PLAYER_INJURY',
              'KEY_PLAYER_YELLOW_CARD_SUSPENSION',
            ],
          },
          player: String,
          comments: String,
        },
      ],
    },
    away: {
      performance: {
        type: String,
        enum: ['LOW', 'MIDDLE', 'HIGH'],
      },
      analyses: [
        {
          level: {
            type: String,
            enum: ['LUCKY', 'UNLUCKY'],
          },
          minute: Number,
          type: {
            type: String,
            enum: [
              'GOAL',
              'NO_GOAL',
              'LAST_MINUTE_GOAL',
              'PENALTY',
              'NO_PENALTY',
              'RED_CARD',
              'NO_RED_CARD',
              'KEY_PLAYER_INJURY',
              'KEY_PLAYER_YELLOW_CARD_SUSPENSION',
            ],
          },
          player: String,
          comments: String,
        },
      ],
    },
  },
});

export const Fixtures = mongoose.model('fixtures', fixturesSchema);
