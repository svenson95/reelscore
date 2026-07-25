import moment from 'moment';
import type { FilterQuery } from 'mongoose';

import type {
  CompetitionId,
  CompetitionRound,
  ExtendedFixtureDTO,
  FixtureDateString,
  FixtureDTO,
  FixtureId,
} from '@lib/models';
import { COMPETITION_ROUNDS, getSeason, TIMEZONE } from '@lib/shared';

import { Fixtures } from '../models';

type FixturesByCompetitionAndRoundsQuery = {
  'league.id': CompetitionId;
  'league.season': number;
};

export class FixturesService {
  async findById(fixtureId: FixtureId): Promise<ExtendedFixtureDTO> {
    const fixture = await Fixtures.findOne({ 'fixture.id': fixtureId }).lean();

    if (!fixture) {
      throw new Error(`Fixture with id ${fixtureId} not found`);
    }

    return fixture;
  }

  async findByDate(date: FixtureDateString): Promise<FixtureDTO[]> {
    const start = moment.tz(date, 'YYYY-MM-DD', true, TIMEZONE).startOf('day');

    if (!start.isValid()) {
      throw new Error(`Invalid fixture date: ${date}`);
    }

    const startTimestamp = start.unix();
    const endTimestamp = start.clone().add(1, 'day').unix();

    return Fixtures.find({
      'fixture.timestamp': {
        $gte: startTimestamp,
        $lt: endTimestamp,
      },
    })
      .sort({ 'fixture.timestamp': 1 })
      .lean<FixtureDTO[]>()
      .exec();
  }

  async findByCompetitionAndRounds(
    competitionId: CompetitionId,
    rounds: CompetitionRound[],
    showAll: boolean
  ): Promise<FixtureDTO[]> {
    const season = getSeason(competitionId);
    const query: FilterQuery<FixturesByCompetitionAndRoundsQuery> = {
      'league.id': competitionId,
      'league.season': season,
    };

    if (showAll) {
      const competitionRounds = COMPETITION_ROUNDS[season]?.[competitionId];
      if (!competitionRounds) return [];

      const allRounds = Object.values(competitionRounds);

      const firstRound = rounds[0];
      const lastRound = rounds[rounds.length - 1];
      const currentRound = rounds.length > 1 ? lastRound : firstRound;

      const currentRoundIndex = allRounds.findIndex(
        (round) => round === currentRound
      );

      const finishedRounds = allRounds.filter(
        (_, index) => index <= currentRoundIndex
      );

      query['league.round'] = { $in: finishedRounds };
    } else {
      query['league.round'] = { $in: rounds };
    }

    return Fixtures.find(query)
      .sort({ 'fixture.timestamp': -1 })
      .lean<FixtureDTO[]>()
      .exec();
  }

  async findByFixtureAndTeamType(
    fixture: ExtendedFixtureDTO,
    team: 'home' | 'away',
    limit = 5
  ): Promise<ExtendedFixtureDTO[]> {
    const teamId = fixture.teams[team].id;
    const date = fixture.fixture.timestamp;

    return Fixtures.find({
      'fixture.timestamp': {
        $lt: date,
      },
      $or: [{ 'teams.home.id': teamId }, { 'teams.away.id': teamId }],
    })
      .sort({ 'fixture.timestamp': -1 })
      .limit(limit)
      .lean<ExtendedFixtureDTO[]>()
      .exec();
  }
}
