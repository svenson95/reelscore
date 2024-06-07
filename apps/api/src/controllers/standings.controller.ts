import { Standings } from '../models';

export const getStanding = async (req, res, next) => {
  const leagueId = req.query.league;
  const season = 2023;
  const query = { 'league.id': leagueId, 'league.season': season };

  try {
    const docs = await Standings.find(query).sort({ _id: -1 });
    return next(docs[0]);
  } catch (error) {
    return res.json({
      status: 'error happened',
      error,
    });
  }
};

export const getTopFiveStandings = async (req, res, next) => {
  const season = 2023;
  const query = {
    'league.id': ['39', '78', '135', '140', '61'],
    $and: [{ 'league.season': season }],
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
    return next(topFiveRanks(docs));
  } catch (error) {
    return res.json({
      status: 'error happened',
      error,
    });
  }
};
