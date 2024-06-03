import { Standings } from '../models';

export const getStandings = (req, res, next) => {
  const leagueId = req.query.league;
  const season = 2023;

  if (leagueId !== undefined) {
    const query = { 'league.id': leagueId, 'league.season': season };
    Standings.find(query)
      .sort({ _id: -1 })
      .then((data) => next(data[0]))
      .catch((error) =>
        res.json({
          status: 'error happened',
          error: error,
        })
      );
  } else {
    const query = {
      'league.id': ['39', '78', '135', '140', '61'],
      $and: [{ 'league.season': season }],
    };
    Standings.find(query)
      .sort({ _id: -1 })
      .limit(5)
      .then((data) => next(topFiveRanks(data)))
      .catch((error) =>
        res.json({
          status: 'error happened',
          error: error,
        })
      );
  }
};

const topFiveRanks = (data) =>
  data.map((d) => ({
    league: {
      ...d.league,
      standings: [d.league.standings[0].slice(0, 5)],
    },
  }));
