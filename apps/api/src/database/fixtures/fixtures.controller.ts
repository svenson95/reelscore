import type { FlattenMaps } from 'mongoose';

import {
  COMPETITION_ROUNDS,
  STATUS_VALUE_ABANDONED,
  STATUS_VALUE_CANCELLED,
  STATUS_VALUE_POSTPONED,
  STATUS_VALUES_FINISHED,
  STATUS_VALUES_NOT_PLAYED,
  STATUS_VALUES_PLAYING,
} from '@reelscore-sdk/constants';
import { getSeason } from '@reelscore-sdk/helpers';
import type {
  CompetitionId,
  CompetitionRound,
  FixtureDateString,
  FixtureDTO,
} from '@reelscore-sdk/models';

import { Fixtures } from './fixtures.model';
import { FixturesService } from './fixtures.service';

export type CompetitionRequestType = 'last' | 'next';

const ONE_ROUND_REVERSED_COMPETITION = 10 as CompetitionId;
const FINISHED_STATES = STATUS_VALUES_FINISHED;
const NON_UPCOMING_STATES = [
  ...STATUS_VALUES_FINISHED,
  ...STATUS_VALUES_PLAYING,
  STATUS_VALUE_CANCELLED,
  STATUS_VALUE_POSTPONED,
  STATUS_VALUE_ABANDONED,
  ...STATUS_VALUES_NOT_PLAYED,
];

export class FixturesController {
  private readonly fixturesService = new FixturesService();

  private readonly getFixturesWithResultQuery = () => ({
    $or: [
      {
        'fixture.status.short': {
          $in: FINISHED_STATES,
        },
      },
      {
        'fixture.status.short': {
          $in: STATUS_VALUES_PLAYING,
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

  private readonly getFixturesWithoutResultQuery = () => ({
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

  private readonly getRoundIdentifier = (round: CompetitionRound): string => {
    let suffixStart = round.length;

    while (suffixStart > 0) {
      const characterCode = round.codePointAt(suffixStart - 1);
      const isDigit =
        characterCode !== undefined &&
        characterCode >= 48 &&
        characterCode <= 57;

      if (!isDigit) break;
      suffixStart -= 1;
    }

    return suffixStart === round.length ? round : round.slice(suffixStart);
  };

  private readonly getRoundsToLoad = (
    rounds: CompetitionRound[],
    selectedRound: CompetitionRound,
    type: CompetitionRequestType,
    showAll: boolean
  ): CompetitionRound[] => {
    if (type === 'next' || showAll) return rounds;

    const selectedRoundIndex = rounds.indexOf(selectedRound);
    if (selectedRoundIndex < 0) {
      return [selectedRound];
    }

    const recentRoundIdentifiers = new Set<string>();

    for (
      let index = selectedRoundIndex;
      index >= 0 && recentRoundIdentifiers.size < 3;
      index -= 1
    ) {
      recentRoundIdentifiers.add(this.getRoundIdentifier(rounds[index]));
    }

    return rounds.filter((round) =>
      recentRoundIdentifiers.has(this.getRoundIdentifier(round))
    );
  };

  private readonly getLastResultRound = async (
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

  private readonly getNextUpcomingRound = async (
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

  private readonly getOneRoundCompetitionFixtures = async (
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

    const roundsToLoad = this.getRoundsToLoad(
      rounds,
      selectedRound,
      type,
      showAll
    );

    const fixtures = await Fixtures.find({
      'league.id': id,
      'league.season': season,
      'league.round': { $in: roundsToLoad },
      ...(type === 'last'
        ? this.getFixturesWithResultQuery()
        : this.getFixturesWithoutResultQuery()),
    })
      .sort({ 'fixture.date': type === 'last' ? -1 : 1 })
      .lean();

    if (!fixtures.length) return [];

    const fixturesRounds = [...new Set(fixtures.map((f) => f.league.round))];

    return fixturesRounds.map((round) =>
      fixtures.filter((fixture) => fixture.league.round === round)
    );
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
