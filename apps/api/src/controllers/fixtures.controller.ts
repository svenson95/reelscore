import { Fixtures } from '../models';

export const getFixturesById = async (req, res, fixtureId, next) => {
  try {
    const docs = await Fixtures.find({ 'fixture.id': fixtureId });
    next(docs[0]);
  } catch (error) {
    next({
      status: 'error happened',
      error,
    });
  }
};

export const getFixturesByTeamId = async (req, res, teamId, next) => {
  const homeTeamId = { 'teams.home.id': teamId };
  const awayTeamId = { 'teams.away.id': teamId };
  const currentSeason = { 'league.season': 2023 };

  try {
    const docs = await Fixtures.find({
      $or: [homeTeamId, awayTeamId],
      $and: [currentSeason],
    });
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

  try {
    const docs = await Fixtures.find({
      'league.id': leagueId,
      'league.round': roundString,
      'league.season': 2023,
    });
    next(docs);
  } catch (error) {
    next({
      status: 'error happened',
      error,
    });
  }
};

export const getFixturesByDate = async (req, res, date, next) => {
  const day = new Date(date);
  day.setHours(0, 0, 0, 0);

  const tomorrow = new Date(day);
  tomorrow.setDate(tomorrow.getDate() + 1);

  try {
    const docs = await Fixtures.find()
      .where('fixture.date')
      .gte(Number(day))
      .lt(Number(tomorrow))
      .where('league.id')
      .in(['39', '78', '135', '140', '61'])
      .sort({ 'fixture.date': 1 })
      .select({
        'fixture.date': 1,
        'fixture.id': 1,
        'league.name': 1,
        'league.id': 1,
        'score.fulltime': 1,
        teams: 1,
      });
    next(docs);
  } catch (error) {
    next({
      status: 'error happened',
      error,
    });
  }
};

export const getLatestFixtures = async (req, res, next) => {
  const fixtureId = req.query.fixtureId;
  try {
    const fixtureDoc = await Fixtures.findOne({
      'fixture.id': fixtureId,
    });

    const home = await findLatestFixturesForTeam(
      fixtureDoc.teams.home.id,
      fixtureDoc.fixture.date
    );

    const away = await findLatestFixturesForTeam(
      fixtureDoc.teams.away.id,
      fixtureDoc.fixture.date
    );

    next({ home, away });
  } catch (error) {
    next({
      status: 'error happened',
      error,
    });
  }
};

const findLatestFixturesForTeam = async (teamId: number, date: string) =>
  await Fixtures.find()
    .where('fixture.date')
    .lt(Number(date))
    .or([{ 'teams.home.id': teamId }, { 'teams.away.id': teamId }])
    .limit(5)
    .sort({ 'fixture.date': -1 });
