import { APP_DATA, getSeason } from '../middleware';
import { Standings } from '../models';

export const getStanding = async (req, res, next) => {
  const leagueId = req.query.league;
  const [year, month, day] = req.query.date.split('-');
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setDate(date.getDate() + 1);
  const query = {
    'league.id': leagueId,
    'league.season': APP_DATA.season,
    $and: [{ createdAt: { $lte: date } }],
  };

  try {
    const docs = await Standings.find(query).sort({ _id: -1 });
    next(docs);
  } catch (error) {
    next({
      status: 'error happened',
      error,
    });
  }
};

export const getTopFiveStandings = async (req, res, next) => {
  const [year, month, day] = req.query.date.split('-');
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setDate(date.getDate() + 1);

  const query = (leagueId) => ({
    'league.id': leagueId,
    $and: [{ createdAt: { $lte: date } }],
  });

  const BUNDESLIGA_ID = '78';
  const PREMIER_LEAGUE_ID = '39';
  const LA_LIGA_ID = '140';
  const SERIE_A_ID = '135';
  const LIGUE_1_ID = '61';
  const getStandings = async (leagueId) =>
    await Standings.findOne(query(leagueId)).sort({ _id: -1 });

  // getStandings implementation doesnt work for last season, because standings were fetched after season
  const dateFixStandings = async (leagueId) =>
    await Standings.findOne({
      'league.id': leagueId,
      $and: [{ 'league.season': getSeason(req.query.date) }],
    }).sort({ _id: -1 });

  const bundesliga = await getStandings(BUNDESLIGA_ID);
  const premierLeague = await getStandings(PREMIER_LEAGUE_ID);
  const laLiga = await getStandings(LA_LIGA_ID);
  const serieA = await getStandings(SERIE_A_ID);
  const ligue1 = await getStandings(LIGUE_1_ID);

  const data = topFiveRanks([
    bundesliga ?? (await dateFixStandings(BUNDESLIGA_ID)),
    premierLeague ?? (await dateFixStandings(PREMIER_LEAGUE_ID)),
    laLiga ?? (await dateFixStandings(LA_LIGA_ID)),
    serieA ?? (await dateFixStandings(SERIE_A_ID)),
    ligue1 ?? (await dateFixStandings(LIGUE_1_ID)),
  ]);

  next(data);
};

const topFiveRanks = (data) =>
  data.map((d) => ({
    league: {
      ...d.league,
      standings: [d.league.standings[0].slice(0, 5)],
    },
  }));
