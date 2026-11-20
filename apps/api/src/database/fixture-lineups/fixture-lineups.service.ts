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
    const filter = { 'parameters.fixture': fixtureId };
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
