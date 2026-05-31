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
    date: string | null
  ): Promise<StandingsDTO | null> {
    const season = date ? getSeason(id, date) : getSeason(id);

    return this.findLatestStandingsBySeason(id, season, date ?? undefined);
  }

  async getTopFive(date: string): Promise<StandingsDTO[]> {
    const standingsIds: Array<CompetitionId> = [
      78, // BUNDESLIGA_ID,
      39, // PREMIER_LEAGUE_ID,
      140, // LA_LIGA_ID,
      135, // SERIE_A_ID,
      61, // LIGUE_1_ID,
    ];
    const standings = await this.loadStandings(standingsIds, date);
    return this.mapToOnlyTopFiveRankings(standings);
  }

  private async loadStandings(
    standingsIds: number[],
    date: string
  ): Promise<StandingsDTO[]> {
    const [year, month, day] = date.split('-').map(Number);

    const tomorrow = new Date(Date.UTC(year, month - 1, day));
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

    const standings: StandingsDTO[] = [];

    for (const standingsId of standingsIds) {
      const season = month >= 8 ? year : year - 1;

      const leagueStandings = await this.standingsService.findByFilter({
        'league.id': standingsId,
        'league.season': season,
        createdAt: { $lte: tomorrow },
      });

      if (leagueStandings) {
        standings.push(leagueStandings);
      }
    }

    return standings;
  }

  private mapToOnlyTopFiveRankings(data: StandingsDTO[]): StandingsDTO[] {
    const baseStandings = 0; // 1 == home standings, 2 == away standings

    return data.flatMap((d) => {
      const standings = d.league?.standings?.[baseStandings];

      if (!standings) {
        return [];
      }

      return [
        {
          ...d,
          league: {
            ...d.league,
            standings: [standings.slice(0, 5)],
          },
        },
      ];
    });
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
      console.log(`${date}T23:59:59.999Z`);
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
