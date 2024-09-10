import {
  CompetitionId,
  CompetitionRoundString,
  EventDTO,
  FinishedMatchStatusValues,
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

export const getLastFixturesForCompetition = async (id: CompetitionId) => {
  const currentRound = await getCurrentRound(id);
  return await getFixturesForCompetitionByRound(id, currentRound);
};

export const getNextFixturesForCompetition = async (id: CompetitionId) => {
  const currentRound = await getCurrentRound(id);
  const rounds = Object.values(COMPETITION_ROUNDS[id]);
  const nextRound = getNextRound(rounds, currentRound);
  return await getFixturesForCompetitionByRound(id, nextRound);
};

export const getFixturesForCompetitionByRound = async (
  competitionId,
  round
) => {
  const rounds = Object.values(COMPETITION_ROUNDS[competitionId]);
  const nextRound = getNextRound(rounds, round);
  const roundNumber = round[round.length - 1];
  const nextRoundNumber = nextRound[nextRound.length - 1];
  const hasMultipleRounds =
    round.includes('League') && roundNumber === nextRoundNumber;

  let query: { [key: string]: string | number | unknown } = {
    'league.id': competitionId,
    'league.season': APP_DATA.season,
    'league.round': round,
  };

  if (hasMultipleRounds) {
    query = await updateQueryToGetAllGroups(
      query,
      competitionId,
      round,
      roundNumber
    );
  }

  const fixtures = await Fixtures.find(query)
    .sort({ 'fixture.date': -1 })
    .lean();

  if (hasMultipleRounds) {
    const rounds = [...new Set(fixtures.map((f) => f.league.round))];
    return rounds.map((round) =>
      fixtures.filter((f) => f.league.round === round)
    );
  }

  return [fixtures];
};

const updateQueryToGetAllGroups = async (query, id, round, roundNumber) => {
  const leagueRound = (group: string) => `League ${group} - ${roundNumber}`;
  const leagueRounds = [
    leagueRound('A'),
    leagueRound('B'),
    leagueRound('C'),
    leagueRound('D'),
  ];

  let newQuery = query;
  const currentRound = await getCurrentRound(id);

  newQuery = {
    ...query,
    'league.round': { $in: leagueRounds },
  };

  if (round === currentRound) {
    newQuery = {
      ...newQuery,
      'fixture.status.short': { $in: FinishedMatchStatusValues },
    };
  } else {
    newQuery = {
      ...newQuery,
      'fixture.status.short': { $nin: FinishedMatchStatusValues },
    };
  }

  return newQuery;
};

export const getCurrentRound = async (
  competitionId: CompetitionId
): Promise<string> => {
  const currentSeason = { 'league.season': APP_DATA.season };
  const isMatchFinished = { 'fixture.status.long': 'Match Finished' };
  const lastMatch = await Fixtures.findOne({
    'league.id': competitionId,
    $and: [currentSeason, isMatchFinished],
  }).sort({ 'fixture.date': -1 });
  return lastMatch.league.round;
};

export const getNextRound = (
  rounds: Array<CompetitionRoundString>,
  currentRound: CompetitionRoundString
): string => {
  const currentRoundIndex = rounds.indexOf(currentRound);
  const isLastRound = rounds.length - 1 === currentRoundIndex;
  if (isLastRound) {
    return rounds[currentRoundIndex];
  }
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
      'score.fulltime': 1,
      teams: 1,
    })
    .lean();
  next(docs);
};

export const getLatestFixtures = async (fixtureId, next) => {
  try {
    const fixture = await Fixtures.findOne({
      'fixture.id': fixtureId,
    }).lean();

    const home = await findLatestFixtures(fixture, 'home');
    const away = await findLatestFixtures(fixture, 'away');

    next({ home, away });
  } catch (error) {
    next({
      status: 'error happened',
      error,
    });
  }
};

export const findLatestFixtures = async (
  fixture: FixtureDTO,
  team: 'home' | 'away'
) => {
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
