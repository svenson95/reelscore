import {
  CompetitionId,
  CompetitionRound,
  CompetitionRoundString,
} from '@lib/models';
import { APP_DATA, COMPETITION_ROUNDS } from '../../middleware';
import { Fixtures } from '../../models';

export const getFixturesForCompetition = async (
  id: CompetitionId,
  type: 'last' | 'next',
  showAll: boolean
) => {
  const currentRound = await getCurrentRound(id);
  if (!currentRound) return [];

  const rounds = Object.values(COMPETITION_ROUNDS[id]);
  const nextRound = getNextRound(rounds, currentRound);
  const hasMultipleRounds = isSameRoundNumber(currentRound, nextRound);
  const round =
    type === 'last'
      ? await getLastFixturesRound(currentRound, hasMultipleRounds, rounds)
      : await getNextFixturesRound(nextRound, hasMultipleRounds, rounds);
  const fixtures = await getFixturesForCompetitionByRound(id, round, showAll);
  const fixturesArray = fixtures.length === 0 ? [] : [fixtures];

  if (hasMultipleRounds || showAll) {
    const fixturesRounds = [...new Set(fixtures.map((f) => f.league.round))];
    const mapped = fixturesRounds.map((round) =>
      fixtures.filter((f) => f.league.round === round)
    );
    return mapped;
  }

  return fixturesArray;
};

const getLastFixturesRound = async (
  currentRound: CompetitionRound,
  hasMultipleRounds: boolean,
  rounds: Array<CompetitionRound>
) => {
  return hasMultipleRounds
    ? getMultipleRounds(currentRound, rounds)
    : [currentRound];
};

const getNextFixturesRound = async (
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
    ? getMultipleRounds(nextMultipleRound, rounds)
    : [nextRound];
};

const isSameRoundNumber = (
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

const getMultipleRounds = (
  round: CompetitionRound,
  rounds: Array<CompetitionRound>
) => {
  const roundNumber = round[round.length - 1];
  return rounds.filter((r) => r.includes(roundNumber));
};

const getFixturesForCompetitionByRound = async (
  competitionId: CompetitionId,
  rounds: CompetitionRoundString[],
  showAll: boolean
) => {
  const query: object = {
    'league.id': competitionId,
    'league.season': APP_DATA.season,
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
};

const getCurrentRound = async (
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

const getNextRound = (
  rounds: Array<CompetitionRoundString>,
  currentRound: CompetitionRoundString
): string | null => {
  const currentRoundIndex = rounds.indexOf(currentRound);
  const isLastRound = rounds.length - 1 === currentRoundIndex;
  if (isLastRound) return null;
  return rounds[currentRoundIndex + 1];
};
