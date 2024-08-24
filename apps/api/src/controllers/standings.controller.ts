import { COMPETITION_ID } from '@lib/constants';
import { getSeason } from '../middleware';
import { Standings } from '../models';

export const getStanding = async (req, res, next) => {
  const leagueId = req.query.league;
  const season = 2023;
  const query = { 'league.id': leagueId, 'league.season': season };

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

  const BUNDESLIGA_ID = COMPETITION_ID.GERMANY_BUNDESLIGA;
  const PREMIER_LEAGUE_ID = COMPETITION_ID.ENGLAND_PREMIER_LEAGUE;
  const LA_LIGA_ID = COMPETITION_ID.SPAIN_LA_LIGA;
  const SERIE_A_ID = COMPETITION_ID.ITALY_SERIE_A;
  const LIGUE_1_ID = COMPETITION_ID.FRANCE_LIGUE_1;

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
