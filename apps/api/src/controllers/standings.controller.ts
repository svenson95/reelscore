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
  const query = {
    'league.id': ['39', '78', '135', '140', '61'],
    $and: [{ 'league.season': getSeason(req.query.date) }],
  };

  try {
    const docs = await Standings.find(query).sort({ _id: -1 }).limit(5);
    const topFiveRanks = (data) =>
      data.map((d) => ({
        league: {
          ...d.league,
          standings: [d.league.standings[0].slice(0, 5)],
        },
      }));
    next(topFiveRanks(docs));
  } catch (error) {
    next({
      status: 'error happened',
      error,
    });
  }
};
