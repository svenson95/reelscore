import { FlattenMaps } from 'mongoose';

import {
  CompetitionId,
  CompetitionRound,
  CompetitionRoundString,
  FixtureDateString,
  FixtureDTO,
} from '@lib/models';

import { APP_DATA, COMPETITION_ROUNDS } from '../middleware';
import { Fixtures } from '../models';
import { FixturesService } from '../services';

export type CompetitionRequestType = 'last' | 'next';

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
    nextRound: CompetitionRound,
    hasMultipleRounds: boolean,
    rounds: Array<CompetitionRound>
  ) => {
    if (!nextRound) return [];
    const nextRoundNumber = Number(nextRound[nextRound.length - 1]);
    const nextMultipleRound = nextRound.replace(
      String(nextRoundNumber),
      String(nextRoundNumber + 1)
    );
    return hasMultipleRounds
      ? this.getMultipleRounds(nextMultipleRound, rounds)
      : [nextRound];
  };

  private isSameRoundNumber = (
    currentRound: CompetitionRound,
    nextRound: CompetitionRound | null
  ) => {
    if (!nextRound) return false;
    const currentRoundNumber = Number(currentRound[currentRound.length - 1]);
    const nextRoundNumber = Number(nextRound[nextRound.length - 1]);

    return (
      typeof nextRoundNumber === 'number' &&
      typeof nextRoundNumber === 'number' &&
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
  ): Promise<string | null> => {
    const currentSeason = { 'league.season': APP_DATA.season };
    const isMatchFinished = { 'fixture.status.long': 'Match Finished' };
    const lastMatch = await Fixtures.findOne({
      'league.id': competitionId,
      $and: [currentSeason, isMatchFinished],
    }).sort({ 'fixture.date': -1 });
    if (!lastMatch) return null;
    return lastMatch.league.round;
  };

  private getNextRound = (
    rounds: Array<CompetitionRoundString>,
    currentRound: CompetitionRoundString
  ): string | null => {
    const currentRoundIndex = rounds.indexOf(currentRound);
    const isLastRound = rounds.length - 1 === currentRoundIndex;
    if (isLastRound) return null;
    return rounds[currentRoundIndex + 1];
  };
}

export async function competitionFixtures(
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
