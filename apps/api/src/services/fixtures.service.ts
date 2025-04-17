import {
  CompetitionId,
  CompetitionRound,
  ExtendedFixtureDTO,
  FixtureDateString,
  FixtureDTO,
  FixtureId,
} from '@lib/models';

import { COMPETITION_ROUNDS, getSeason } from '../middleware';
import { Fixtures } from '../models';

export class FixturesService {
  async findById(fixtureId: FixtureId): Promise<ExtendedFixtureDTO> {
    const fixture = await Fixtures.findOne({ 'fixture.id': fixtureId }).lean();
    return fixture;
  }

  async findByDate(date: FixtureDateString): Promise<FixtureDTO[]> {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(dayStart);
    dayEnd.setHours(23);
    dayEnd.setMinutes(59);

    return await Fixtures.find()
      .where('fixture.date')
      .gte(dayStart.getTime())
      .lt(dayEnd.getTime())
      .sort({ 'fixture.date': 1 })
      .select({
        final: 1,
        'fixture.date': 1,
        'fixture.id': 1,
        'fixture.status': 1,
        'league.name': 1,
        'league.id': 1,
        'league.round': 1,
        goals: 1,
        teams: 1,
      })
      .lean();
  }

  async findByCompetitionAndRounds(
    competitionId: CompetitionId,
    rounds: CompetitionRound[],
    showAll: boolean
  ): Promise<FixtureDTO[]> {
    const query: object = {
      'league.id': competitionId,
      'league.season': getSeason(competitionId),
    };

    if (showAll) {
      const allRounds = Object.values(COMPETITION_ROUNDS[competitionId]);
      const finishedRounds = allRounds.filter((_, idx) => {
        const firstRound = rounds[0];
        const lastRound = rounds[rounds.length - 1];
        const currentRound = rounds.length > 1 ? lastRound : firstRound;
        return allRounds.findIndex((round) => round === currentRound) >= idx;
      });
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
    team: 'home' | 'away'
  ): Promise<ExtendedFixtureDTO[]> {
    const teamId = fixture.teams[team].id;
    const date = fixture.fixture.date;

    return await Fixtures.find()
      .where('fixture.date')
      .lt(Number(date))
      .or([{ 'teams.home.id': teamId }, { 'teams.away.id': teamId }])
      .limit(5)
      .sort({ 'fixture.date': -1 })
      .lean();
  }
}
