import { CompetitionId, StandingRanks, TeamId } from '@lib/models';
import { isCompetitionWithMultipleGroups } from '@lib/shared';
import { APP_DATA, getSeason } from '../middleware';
import { Standings } from '../models';

export const getStandings = async (req, res, next) => {
  const leagueId = req.query.league;
  const queryDate = req.query.date;
  let query: Record<string, unknown> = {
    'league.id': leagueId,
    'league.season': APP_DATA.season,
  };

  if (queryDate) {
    const [year, month, day] = queryDate.split('-');
    const date = new Date(Date.UTC(year, month - 1, day));
    date.setDate(date.getDate() + 1);
    query = {
      ...query,
      createdAt: { $lte: date },
    };
  }

  const docs = await Standings.find(query).sort({ _id: -1 });

  next(docs);
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

export const getFixtureStandings = async (
  teamIds: string,
  leagueId: CompetitionId
) => {
  const [homeId, awayId] = teamIds.split(',').map((id) => Number(id));
  const query = {
    'league.id': leagueId,
    'league.season': APP_DATA.season,
  };
  const standings = await Standings.findOne(query).sort({ _id: -1 }).lean();

  if (isCompetitionWithMultipleGroups(standings.league.id)) {
    standings.league.standings = [
      standings.league.standings
        .find((standing) =>
          standing.some((s) => s.team.id === homeId || s.team.id === awayId)
        )
        .filter((team) => isHomeOrAwayTeam(team, homeId, awayId)),
    ];
    return standings;
  } else {
    standings.league.standings = standings.league.standings.map(
      (standing, idx) => {
        if (idx === 0) {
          return standing.filter((team) =>
            isHomeOrAwayTeam(team, homeId, awayId)
          );
        }

        if (idx === 1)
          return standing.filter((team) => team.team.id === homeId);
        if (idx === 2)
          return standing.filter((team) => team.team.id === awayId);
      }
    );

    return standings;
  }
};

const isHomeOrAwayTeam = (
  team: StandingRanks,
  homeId: TeamId,
  awayId: TeamId
): boolean => team.team.id === homeId || team.team.id === awayId;
