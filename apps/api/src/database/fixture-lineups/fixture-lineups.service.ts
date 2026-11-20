import mongoose from 'mongoose';

import type {
  RapidLineupsDTO,
  RapidPlayersStatisticsDTO,
} from '@reelscore-sdk/models';

import { createMongooseModel } from '../mongodb.helper';

const FixtureLineups = createMongooseModel<RapidLineupsDTO>(
  'fixture-lineups',
  {
    parameters: { fixture: String },
    response: [mongoose.Schema.Types.Mixed],
  },
  { timestamps: false }
);

const PlayersStatistics = createMongooseModel<RapidPlayersStatisticsDTO>(
  'players-statistics',
  {
    parameters: { fixture: String },
    response: [mongoose.Schema.Types.Mixed],
  },
  { timestamps: false }
);

export class MatchLineupsService {
  async findByFixture(fixtureId: string) {
    if (typeof fixtureId !== 'string' || !/^\d+$/.test(fixtureId)) {
      throw new Error('Invalid fixture ID');
    }

    const fixtureNumber = Number(fixtureId);
    if (!Number.isSafeInteger(fixtureNumber)) {
      throw new Error('Invalid fixture ID');
    }

    const filter = { 'parameters.fixture': String(fixtureNumber) };
    const [lineups, playerStatistics] = await Promise.all([
      FixtureLineups.findOne(filter).lean<RapidLineupsDTO>(),
      PlayersStatistics.findOne(filter).lean<RapidPlayersStatisticsDTO>(),
    ]);

    return {
      lineups: lineups?.response ?? [],
      playerStatistics: playerStatistics?.response ?? [],
    };
  }
}
