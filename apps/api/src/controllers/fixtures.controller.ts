import { FlattenMaps } from 'mongoose';

import {
  type CompetitionId,
  type CompetitionRound,
  type FixtureDateString,
  type FixtureDTO,
} from '@lib/models';

import {
  STATUS_TYPES_FINISHED,
  STATUS_TYPES_NOT_PLAYED,
  STATUS_VALUE_ABANDONED,
  STATUS_VALUE_CANCELLED,
  STATUS_VALUE_POSTPONED,
} from '../helper';

import { COMPETITION_ROUNDS, getSeason } from '../middleware';
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

  async getByDate(date: FixtureDateString): Promise<FixtureDTO[]> {
    const fixtures = await this.fixturesService.findByDate(date);
    return fixtures;
  }

  async getCompetitionFixtures(
    id: CompetitionId,
    type: CompetitionRequestType,
    showAll: boolean
  ): Promise<FlattenMaps<FixtureDTO>[][]> {
    if (id === ONE_ROUND_REVERSED_COMPETITION) {
      return this.getOneRoundCompetitionFixtures(id, type);
    }

    const currentRound = await this.getCurrentRound(id);
    if (!currentRound) return [];

    const rounds = Object.values(COMPETITION_ROUNDS[id]);
    const nextRound = this.getNextRound(rounds, currentRound);
    const hasMultipleRounds = this.isSameRoundNumber(currentRound, nextRound);

    const round =
      type === 'last'
        ? await this.getLastFixturesRound(
            currentRound,
            hasMultipleRounds,
            rounds
          )
        : await this.getNextFixturesRound(nextRound, hasMultipleRounds, rounds);

    const fixtures = await this.fixturesService.findByCompetitionAndRounds(
      id,
      round,
      showAll
    );

    const fixturesArray = fixtures.length === 0 ? [] : [fixtures];

    if (hasMultipleRounds || showAll) {
      const fixturesRounds = [...new Set(fixtures.map((f) => f.league.round))];

      return fixturesRounds.map((round) =>
        fixtures.filter((f) => f.league.round === round)
      );
    }

    return fixturesArray;
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

  private getLastFixturesRound = async (
    currentRound: CompetitionRound,
    hasMultipleRounds: boolean,
    rounds: Array<CompetitionRound>
  ) => {
    return hasMultipleRounds
      ? this.getMultipleRounds(currentRound, rounds)
      : [currentRound];
  };

  private getNextFixturesRound = async (
    nextRound: CompetitionRound | null,
    hasMultipleRounds: boolean,
    rounds: Array<CompetitionRound>
  ): Promise<CompetitionRound[]> => {
    if (!nextRound) return [];

    const nextRoundNumber = Number(nextRound[nextRound.length - 1]);
    const nextMultipleRound = nextRound.replace(
      String(nextRoundNumber),
      String(nextRoundNumber + 1)
    ) as CompetitionRound;

    return hasMultipleRounds
      ? this.getMultipleRounds(nextMultipleRound, rounds)
      : [nextRound];
  };

  private isSameRoundNumber = (
    currentRound: CompetitionRound,
    nextRound: CompetitionRound | null
  ): boolean => {
    if (!nextRound) return false;

    const currentRoundNumber = Number(currentRound[currentRound.length - 1]);
    const nextRoundNumber = Number(nextRound[nextRound.length - 1]);

    return (
      !Number.isNaN(currentRoundNumber) &&
      !Number.isNaN(nextRoundNumber) &&
      currentRoundNumber === nextRoundNumber
    );
  };

  private getMultipleRounds = (
    round: CompetitionRound,
    rounds: Array<CompetitionRound>
  ) => {
    const roundNumber = round[round.length - 1];
    return rounds.filter((r) => r.includes(roundNumber));
  };

  private getCurrentRound = async (
    competitionId: CompetitionId
  ): Promise<CompetitionRound | null> => {
    const currentSeason = { 'league.season': getSeason(competitionId) };
    const finishedStates = STATUS_TYPES_FINISHED;
    const isMatchFinished = { 'fixture.status.short': finishedStates };

    const lastMatch = await Fixtures.findOne({
      'league.id': competitionId,
      $and: [currentSeason, isMatchFinished],
    }).sort({ 'fixture.date': -1 });

    if (!lastMatch) return null;

    return lastMatch.league.round;
  };

  private getNextRound = (
    rounds: Array<CompetitionRound>,
    currentRound: CompetitionRound
  ): CompetitionRound | null => {
    const currentRoundIndex = rounds.indexOf(currentRound);
    const isLastRound = rounds.length - 1 === currentRoundIndex;

    if (isLastRound) return null;

    return rounds[currentRoundIndex + 1];
  };
}
