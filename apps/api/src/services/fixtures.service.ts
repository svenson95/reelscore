import type { FilterQuery } from 'mongoose';

import type {
  CompetitionId,
  CompetitionRound,
  ExtendedFixtureDTO,
  FixtureDateString,
  FixtureDTO,
  FixtureId,
} from '@lib/models';
import { COMPETITION_ROUNDS, getDateInTimezone, getSeason } from '@lib/shared';

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
    const start = getDateInTimezone(date).startOf('day').toDate();
    const end = getDateInTimezone(date).add(1, 'day').startOf('day').toDate();

    return await Fixtures.find({
      'fixture.date': {
        $gte: start,
        $lt: end,
      },
    })
      .sort({ 'fixture.date': 1 })
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

    const fixtures = await Fixtures.find(query)
      .sort({ 'fixture.date': -1 })
      .lean();

    return fixtures;
  }

  async findByFixtureAndTeamType(
    fixture: ExtendedFixtureDTO,
    team: 'home' | 'away',
    limit = 5
  ): Promise<ExtendedFixtureDTO[]> {
    const teamId = fixture.teams[team].id;
    const date = fixture.fixture.date;

    return await Fixtures.find()
      .where('fixture.date')
      .lt(Number(date))
      .or([{ 'teams.home.id': teamId }, { 'teams.away.id': teamId }])
      .limit(limit)
      .sort({ 'fixture.date': -1 })
      .lean();
  }

  private isDstInBerlin(year: number, month: number, day: number): boolean {
    const date = new Date(Date.UTC(year, month - 1, day));
    const jan = new Date(Date.UTC(year, 0, 1)).getTimezoneOffset();
    const jul = new Date(Date.UTC(year, 6, 1)).getTimezoneOffset();
    return Math.min(jan, jul) !== date.getTimezoneOffset();
  }
}
