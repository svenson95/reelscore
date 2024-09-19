import { APP_DATA } from '../../middleware';
import { Standings } from '../../models';

export const getFixtureStandings = async (teamIds: string, leagueId) => {
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

const isHomeOrAwayTeam = (team, homeId, awayId): boolean =>
  team.team.id === homeId || team.team.id === awayId;

// TODO check why importing lib causes serverless function crash
const isCompetitionWithMultipleGroups = (competitionId) =>
  [4, 5].includes(competitionId);
