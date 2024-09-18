import {
  CompetitionId,
  CompetitionRoundString,
  EventDTO,
  FixtureDTO,
} from '@lib/models';
import { COMPETITION_ROUNDS } from '../middleware';
import { APP_DATA } from '../middleware/app.data';
import { FixtureEvents, Fixtures } from '../models';

const getFixtureHighlights = (events: EventDTO[] | undefined) => {
  if (!events) return [];
  const goals = events.filter(
    (event) => event.type === 'Goal' && event.detail !== 'Missed Penalty'
  );
  const redCards = events.filter(
    (event) => event.type === 'Card' && event.detail === 'Red Card'
  );
  return [...goals, ...redCards].sort((a, b) => {
    const time = (t) => t.time.elapsed + (t.time.extra ?? 0);
    return time(a) - time(b);
  });
};

export const getFixturesById = async (req, res, fixtureId, next) => {
  const data = await Fixtures.findOne({ 'fixture.id': fixtureId }).lean();
  const eventsDoc = await FixtureEvents.findOne({
    'parameters.fixture': fixtureId,
  }).lean();
  const highlights = getFixtureHighlights(eventsDoc?.response);
  next({ data, highlights });
};

export const getFixturesByTeamId = async (req, res, teamId, next) => {
  const homeTeamId = { 'teams.home.id': teamId };
  const awayTeamId = { 'teams.away.id': teamId };
  const currentSeason = { 'league.season': APP_DATA.season };

  try {
    const docs = await Fixtures.find({
      $or: [homeTeamId, awayTeamId],
      $and: [currentSeason],
    }).lean();
    next(docs);
  } catch (error) {
    next({
      status: 'error happened',
      error,
    });
  }
};

export const getFixturesByRound = async (req, res, round, next) => {
  const leagueId = req.query.league;
  const roundString = round ? `Regular Season - ${round}` : null;

  const docs = await Fixtures.find({
    'league.id': leagueId,
    'league.round': roundString,
    'league.season': APP_DATA.season,
  }).lean();
  next(docs);
};

export const getFixturesForCompetition = async (
  id,
  type: 'last' | 'next',
  showAll: boolean,
  next
) => {
  const currentRound = await getCurrentRound(id);
  if (!currentRound) return next([]);

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
    return next(mapped);
  }

  next(fixturesArray);
};

const getLastFixturesRound = async (
  currentRound,
  hasMultipleRounds,
  rounds
) => {
  return hasMultipleRounds
    ? getMultipleRounds(currentRound, rounds)
    : [currentRound];
};

const getNextFixturesRound = async (nextRound, hasMultipleRounds, rounds) => {
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

const isSameRoundNumber = (currentRound, nextRound) => {
  if (!nextRound) return false;
  const currentRoundNumber = Number(currentRound[currentRound.length - 1]);
  const nextRoundNumber = Number(nextRound[nextRound.length - 1]);

  return (
    typeof nextRoundNumber === 'number' &&
    typeof nextRoundNumber === 'number' &&
    currentRoundNumber === nextRoundNumber
  );
};

const getMultipleRounds = (round, rounds) => {
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

export const getFixturesByDate = async (req, res, date, next) => {
  const day = new Date(date);
  day.setHours(0, 0, 0, 0);

  const tomorrow = new Date(day);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const docs = await Fixtures.find()
    .where('fixture.date')
    .gte(Number(day))
    .lt(Number(tomorrow))
    .sort({ 'fixture.date': 1 })
    .select({
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
  next(docs);
};

export const getLatestFixtures = async (
  fixtureId,
  next: (data: { home: FixtureDTO[]; away: FixtureDTO[] }) => void
): Promise<void> => {
  const fixture = await Fixtures.findOne({
    'fixture.id': fixtureId,
  }).lean();

  const home = await findLatestFixtures(fixture, 'home');
  const away = await findLatestFixtures(fixture, 'away');

  next({ home, away });
};

export const findLatestFixtures = async (
  fixture: FixtureDTO,
  team: 'home' | 'away'
): Promise<FixtureDTO[]> => {
  const teamId = fixture.teams[team].id;
  const date = fixture.fixture.date;

  return await Fixtures.find()
    .where('fixture.date')
    .lt(Number(date))
    .or([{ 'teams.home.id': teamId }, { 'teams.away.id': teamId }])
    .limit(5)
    .sort({ 'fixture.date': -1 })
    .lean();
};
