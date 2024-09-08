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
  const goals = events.filter((event) => event.type === 'Goal');
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
  next
) => {
  const currentRound = await getCurrentRound(id);
  if (type === 'last') {
    const fixtures = await getFixturesForCompetitionByRound(id, currentRound);
    next(fixtures);
  } else if (type === 'next') {
    const rounds = Object.values(COMPETITION_ROUNDS[id]);
    const nextRound = getNextRound(rounds, currentRound);
    const fixtures = await getFixturesForCompetitionByRound(id, nextRound);
    next(fixtures);
  }
};

export const getFixturesForCompetitionByRound = async (
  competitionId,
  round
) => {
  const fixtures = await Fixtures.find({
    'league.id': competitionId,
    'league.round': round,
    'league.season': APP_DATA.season,
  })
    .sort({ 'fixture.date': -1 })
    .lean();
  return fixtures;
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
