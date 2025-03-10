import { CompetitionId, StandingsDTO, Team, TeamId } from '@lib/models';

import { APP_DATA, getSeason } from '../middleware';
import { StandingsService } from '../services';

export class StandingsController {
  private standingsService = new StandingsService();

  async getByCompetitionAndDate(
    id: CompetitionId,
    queryDate: string | null
  ): Promise<StandingsDTO | null> {
    const query = {
      'league.id': id,
      'league.season': APP_DATA.season,
    };

    if (queryDate) {
      const [year, month, day] = queryDate.split('-').map((e) => Number(e));
      const date = new Date(Date.UTC(year, month - 1, day));
      date.setDate(date.getDate() + 1);
      query['createdAt'] = { $lte: date };
    }

    const standings = await this.standingsService.findByQuery(query);
    return standings ?? null;
  }

  async getTopFive(date: string): Promise<StandingsDTO[]> {
    const [year, month, day] = date.split('-').map(Number);
    const tomorrow = new Date(Date.UTC(year, month - 1, day));
    tomorrow.setDate(tomorrow.getDate() + 1);

    const standingsIds = [
      78, // BUNDESLIGA_ID,
      39, // PREMIER_LEAGUE_ID,
      140, // LA_LIGA_ID,
      135, // SERIE_A_ID,
      61, // LIGUE_1_ID,
    ];

    const getStandings = async (
      leagueId: CompetitionId
    ): Promise<StandingsDTO> => {
      const standings = await this.standingsService.findByQuery({
        'league.id': leagueId,
        $and: [{ createdAt: { $lte: tomorrow } }],
      });
      return standings;
    };

    // getStandings implementation doesnt work for last season, because standings were fetched after season
    const dateFixStandings = async (
      leagueId: CompetitionId
    ): Promise<StandingsDTO> => {
      const standings = await this.standingsService.findByQuery({
        'league.id': leagueId,
        $and: [{ 'league.season': getSeason(date) }],
      });
      return standings;
    };

    const topFiveStandings = standingsIds.map(async (id) => {
      const standings = await getStandings(id);
      return standings ?? (await dateFixStandings(id));
    });
    const data = await Promise.all(topFiveStandings);
    return this.topFiveRanks(data);
  }

  private topFiveRanks(data: StandingsDTO[]): StandingsDTO[] {
    return data.map((d) => ({
      ...d,
      league: {
        ...d.league,
        standings: [d.league.standings[0].slice(0, 5)],
      },
    }));
  }

  async getFixtureStandings(teamIds: string, leagueId): Promise<StandingsDTO> {
    const [homeId, awayId] = teamIds.split(',').map((id) => Number(id));
    const query = {
      'league.id': leagueId,
      'league.season': APP_DATA.season,
    };
    const standings = await this.standingsService.findByQuery(query);

    if (this.isCompetitionWithMultipleGroups(standings.league.id)) {
      standings.league.standings = [
        standings.league.standings.find((ranks) =>
          ranks.find((s) => this.isHomeOrAwayTeam(s.team, homeId, awayId))
        ),
      ];
      return standings;
    } else {
      standings.league.standings = standings.league.standings.map(
        (standings, index) => {
          const LEAGUE_TABLE = 0;
          const LEAGUE_TABLE_HOME_GAMES = 1;
          const LEAGUE_TABLE_AWAY_GAMES = 2;

          if (index === LEAGUE_TABLE) {
            return standings.filter((s) =>
              this.isHomeOrAwayTeam(s.team, homeId, awayId)
            );
          }

          if (index === LEAGUE_TABLE_HOME_GAMES)
            return standings.filter((s) => s.team.id === homeId);
          if (index === LEAGUE_TABLE_AWAY_GAMES)
            return standings.filter((s) => s.team.id === awayId);
        }
      );

      return standings;
    }
  }

  private isHomeOrAwayTeam(
    team: Team,
    homeId: TeamId,
    awayId: TeamId
  ): boolean {
    return team.id === homeId || team.id === awayId;
  }

  // TODO check why importing lib causes serverless function crash
  private isCompetitionWithMultipleGroups(competitionId): boolean {
    return [4, 5].includes(competitionId);
  }
}
