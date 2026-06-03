import type { FilterQuery } from 'mongoose';

import type {
  CompetitionId,
  StandingRanks,
  StandingsDTO,
  StandingsFilter,
} from '@lib/models';
import { isCompetitionWithMultipleGroups } from '@lib/shared';

import { getSeason } from '../middleware';
import { StandingsService } from '../services';

export class StandingsController {
  private standingsService = new StandingsService();

  async getByCompetitionAndDate(
    id: CompetitionId,
    date: string
  ): Promise<StandingsDTO | null> {
    const season = getSeason(id, date);

    return this.findLatestStandingsBySeason(id, season, date);
  }

  async getTopFiveByCompetitionAndDate(
    id: CompetitionId,
    date: string
  ): Promise<StandingsDTO | null> {
    const standings = await this.getByCompetitionAndDate(id, date);

    if (!standings?.league.standings) {
      return null;
    }

    return {
      ...standings,
      league: {
        ...standings.league,
        standings: [standings.league.standings.flat().slice(0, 5)],
      },
    };
  }

  async getTopFive(date: string): Promise<StandingsDTO[]> {
    const standingsIds: CompetitionId[] = [
      78, // Bundesliga
      39, // Premier League
      140, // La Liga
      135, // Serie A
      61, // Ligue 1
    ];

    const standings = await Promise.all(
      standingsIds.map((id) => this.getTopFiveByCompetitionAndDate(id, date))
    );

    return standings.filter(
      (standing): standing is StandingsDTO => standing !== null
    );
  }

  async getFixtureStandings(
    teamIds: string,
    leagueId: CompetitionId,
    date: string
  ): Promise<StandingsDTO | null> {
    const [homeId, awayId] = teamIds.split(',').map(Number);
    const season = getSeason(leagueId, date);

    const standings = await this.findLatestStandingsBySeason(
      leagueId,
      season,
      date
    );

    if (!standings?.league?.standings?.length) {
      return null;
    }

    const mappedStandings = this.isCompetitionWithMultipleGroups(
      standings.league.id
    )
      ? this.mapMultipleGroupStandings(
          standings.league.standings,
          homeId,
          awayId
        )
      : this.mapLeagueStandings(standings.league.standings, homeId, awayId);

    if (!mappedStandings.length) {
      return null;
    }

    return {
      ...standings,
      league: {
        ...standings.league,
        standings: mappedStandings,
      },
    };
  }

  private async findLatestStandingsBySeason(
    leagueId: CompetitionId,
    season: number,
    date?: string
  ): Promise<StandingsDTO | null> {
    const baseFilter: FilterQuery<StandingsFilter> = {
      'league.id': leagueId,
      'league.season': season,
    };

    if (date) {
      const standingsUntilDate = await this.standingsService.findByFilter(
        {
          ...baseFilter,
          updatedAt: {
            $lte: `${date}T23:59:59.999Z`,
          },
        },
        {
          sort: { updatedAt: -1 },
        }
      );

      if (standingsUntilDate) {
        return standingsUntilDate;
      }
    }

    return this.standingsService.findByFilter(baseFilter, {
      sort: { updatedAt: -1 },
    });
  }

  private mapMultipleGroupStandings(
    standings: StandingRanks[][],
    homeId: number,
    awayId: number
  ): StandingRanks[][] {
    const groupStandings = standings.find((ranks) =>
      ranks.some(
        (standing) => standing.team.id === homeId || standing.team.id === awayId
      )
    );

    return groupStandings ? [groupStandings] : [];
  }

  private mapLeagueStandings(
    standings: StandingRanks[][],
    homeId: number,
    awayId: number
  ): StandingRanks[][] {
    const LEAGUE_TABLE = 0;
    const LEAGUE_TABLE_HOME_GAMES = 1;
    const LEAGUE_TABLE_AWAY_GAMES = 2;

    return standings.map((standingRanks, index) => {
      if (index === LEAGUE_TABLE) {
        return standingRanks.filter(
          (standing) =>
            standing.team.id === homeId || standing.team.id === awayId
        );
      }

      if (index === LEAGUE_TABLE_HOME_GAMES) {
        return standingRanks.filter((standing) => standing.team.id === homeId);
      }

      if (index === LEAGUE_TABLE_AWAY_GAMES) {
        return standingRanks.filter((standing) => standing.team.id === awayId);
      }

      return standingRanks;
    });
  }

  private isCompetitionWithMultipleGroups(
    competitionId: CompetitionId
  ): boolean {
    return isCompetitionWithMultipleGroups(competitionId);
  }
}
