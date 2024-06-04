import { fetchFromRapidApi } from '../middleware';
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

export const getAllStandings = async (req, res, next) => {
  try {
    const docs = await Standings.find();
    return next(docs);
  } catch (error) {
    return res.json({
      status: 'error happened',
      error,
    });
  }
};

export const getAllStandingsCount = async (req, res) => {
  try {
    const length = await Standings.countDocuments();
    return res.json(length);
  } catch (error) {
    return res.json({
      status: 'error happened',
      error,
    });
  }
};

export const fetchStandings = async (req, res, next) => {
  const leagueId = req.query.league;

  const uri = `standings?season=2023&league=${leagueId}`;
  const response = await fetchFromRapidApi(uri);
  const body = await response.json();
  const data = body.response[0];

  try {
    const docs = new Standings(data);
    return next(docs);
  } catch (error) {
    return res.json({
      status: 'error happened',
      error,
    });
  }
};
