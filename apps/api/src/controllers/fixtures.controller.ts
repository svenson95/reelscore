import type { FlattenMaps } from 'mongoose';

import {
  type CompetitionId,
  type CompetitionRound,
  type FixtureDateString,
  type FixtureDTO,
  STATUS_TYPES_FINISHED,
  STATUS_TYPES_NOT_PLAYED,
  STATUS_VALUE_ABANDONED,
  STATUS_VALUE_CANCELLED,
  STATUS_VALUE_POSTPONED,
} from '@lib/models';
import { COMPETITION_ROUNDS, getSeason } from '@lib/shared';

import { Fixtures } from '../models';
import { FixturesService } from '../services';

export type CompetitionRequestType = 'last' | 'next';

const ONE_ROUND_REVERSED_COMPETITION = 10 as CompetitionId;
const FINISHED_STATES = STATUS_TYPES_FINISHED;
const NON_UPCOMING_STATES = [
  ...FINISHED_STATES,
  STATUS_VALUE_CANCELLED,
  STATUS_VALUE_POSTPONED,
  STATUS_VALUE_ABANDONED,
  ...STATUS_TYPES_NOT_PLAYED,
];

export class FixturesController {
  private fixturesService = new FixturesService();

  private getFixturesWithResultQuery = () => ({
    $or: [
      {
        'fixture.status.short': {
          $in: FINISHED_STATES,
        },
      },
      {
        'score.fulltime.home': {
          $ne: null,
        },
        'score.fulltime.away': {
          $ne: null,
        },
      },
    ],
  });

  private getFixturesWithoutResultQuery = () => ({
    $and: [
      {
        'fixture.status.short': {
          $nin: NON_UPCOMING_STATES,
        },
      },
      {
        'fixture.date': {
          $gte: new Date().toISOString(),
        },
      },
      {
        $or: [
          {
            'score.fulltime.home': null,
          },
          {
            'score.fulltime.away': null,
          },
        ],
      },
    ],
  });

  async getByDate(date: FixtureDateString): Promise<FixtureDTO[]> {
    const fixtures = await this.fixturesService.findByDate(date);
    return fixtures;
  }

  private getMultipleRounds = (
    round: CompetitionRound,
    rounds: Array<CompetitionRound>
  ): CompetitionRound[] => {
    const roundNumber = round[round.length - 1];

    return rounds.filter((r) => r.endsWith(roundNumber));
  };

  private hasMultipleRoundsWithSameNumber = (
    round: CompetitionRound,
    rounds: Array<CompetitionRound>
  ): boolean => {
    const roundNumber = round[round.length - 1];

    return rounds.filter((r) => r.endsWith(roundNumber)).length > 1;
  };

  private getLastResultRound = async (
    competitionId: CompetitionId
  ): Promise<CompetitionRound | null> => {
    const fixture = await Fixtures.findOne({
      'league.id': competitionId,
      'league.season': getSeason(competitionId),
      ...this.getFixturesWithResultQuery(),
    })
      .sort({ 'fixture.date': -1 })
      .lean();

    return fixture?.league.round ?? null;
  };

  private getNextUpcomingRound = async (
    competitionId: CompetitionId
  ): Promise<CompetitionRound | null> => {
    const fixture = await Fixtures.findOne({
      'league.id': competitionId,
      'league.season': getSeason(competitionId),
      ...this.getFixturesWithoutResultQuery(),
    })
      .sort({ 'fixture.date': 1 })
      .lean();

    return fixture?.league.round ?? null;
  };

  private getOneRoundCompetitionFixtures = async (
    competitionId: CompetitionId,
    type: CompetitionRequestType
  ): Promise<FlattenMaps<FixtureDTO>[][]> => {
    const currentSeason = { 'league.season': getSeason(competitionId) };

    const resultQuery =
      type === 'last'
        ? this.getFixturesWithResultQuery()
        : this.getFixturesWithoutResultQuery();

    const sortDirection = type === 'last' ? -1 : 1;

    const fixtures = await Fixtures.find({
      'league.id': competitionId,
      ...currentSeason,
      ...resultQuery,
    })
      .sort({ 'fixture.date': sortDirection })
      .lean();

    return fixtures.length ? [fixtures] : [];
  };

  private async getCompetitionFixtures(
    id: CompetitionId,
    type: CompetitionRequestType,
    showAll: boolean
  ): Promise<FlattenMaps<FixtureDTO>[][]> {
    if (id === ONE_ROUND_REVERSED_COMPETITION) {
      return this.getOneRoundCompetitionFixtures(id, type);
    }

    const season = getSeason(id);
    const competitionRounds = COMPETITION_ROUNDS[season]?.[id];
    if (!competitionRounds) return [];

    const rounds = Object.values(competitionRounds);

    const selectedRound =
      type === 'last'
        ? await this.getLastResultRound(id)
        : await this.getNextUpcomingRound(id);

    if (!selectedRound) return [];

    const hasMultipleRounds = this.hasMultipleRoundsWithSameNumber(
      selectedRound,
      rounds
    );

    const round = hasMultipleRounds
      ? this.getMultipleRounds(selectedRound, rounds)
      : [selectedRound];

    const fixtures = await Fixtures.find({
      'league.id': id,
      'league.season': season,
      'league.round': { $in: round },
      ...(type === 'last'
        ? this.getFixturesWithResultQuery()
        : this.getFixturesWithoutResultQuery()),
    })
      .sort({ 'fixture.date': type === 'last' ? -1 : 1 })
      .lean();

    if (!fixtures.length) return [];

    if (hasMultipleRounds || showAll) {
      const fixturesRounds = [...new Set(fixtures.map((f) => f.league.round))];

      return fixturesRounds.map((round) =>
        fixtures.filter((f) => f.league.round === round)
      );
    }

    return [fixtures];
  }

  async competitionFixtures(
    type: CompetitionRequestType,
    id: CompetitionId,
    showAll: boolean
  ): Promise<FlattenMaps<FixtureDTO[]>[]> {
    const fixturesController = new FixturesController();
    const fixtures = await fixturesController.getCompetitionFixtures(
      id,
      type,
      showAll
    );

    return fixtures;
  }
}
