import type { FilterQuery } from 'mongoose';

import { COMPETITION_ID } from '@reelscore-sdk/constants';
import {
  getDateInTimezone,
  getSeason,
  isCompetitionWithMultipleGroups,
} from '@reelscore-sdk/helpers';
import type {
  CompetitionId,
  CompetitionSeason,
  StandingRanks,
  StandingsDTO,
  StandingsFilter,
} from '@reelscore-sdk/models';

import { StandingsService } from './standings.service';

export class StandingsController {
  constructor(
    private readonly standingsService: StandingsReader = new StandingsService()
  ) {}

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
      COMPETITION_ID.GERMANY_BUNDESLIGA,
      COMPETITION_ID.ENGLAND_PREMIER_LEAGUE,
      COMPETITION_ID.SPAIN_LA_LIGA,
      COMPETITION_ID.ITALY_SERIE_A,
      COMPETITION_ID.FRANCE_LIGUE_1,
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

    let mappedStandings: StandingRanks[][];

    if (leagueId === COMPETITION_ID.MAJOR_LEAGUE_SOCCER) {
      mappedStandings = this.getMlsConferenceStandings(
        standings.league.standings
      );
    } else if (isCompetitionWithMultipleGroups(standings.league.id, season)) {
      mappedStandings = this.mapMultipleGroupStandings(
        standings.league.standings,
        homeId,
        awayId
      );
    } else {
      mappedStandings = this.mapLeagueStandings(
        standings.league.standings,
        homeId,
        awayId
      );
    }

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
    season: CompetitionSeason,
    date?: string
  ): Promise<StandingsDTO | null> {
    const baseFilter: FilterQuery<StandingsFilter> = {
      'league.id': leagueId,
      'league.season': season,
    };

    if (!date) {
      return this.standingsService.findByFilter(baseFilter, {
        sort: { updatedAt: -1 },
      });
    }

    const startOfNextDay = getDateInTimezone(date)
      .add(1, 'day')
      .startOf('day')
      .toDate();

    return this.standingsService.findByFilter(
      {
        ...baseFilter,
        updatedAt: {
          $lt: startOfNextDay,
        },
      },
      {
        sort: { updatedAt: -1 },
      }
    );
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

  private getMlsConferenceStandings(
    standings: StandingRanks[][]
  ): StandingRanks[][] {
    const easternConference = standings.find(
      (group) => group[0]?.group === 'Eastern Conference'
    );
    const westernConference = standings.find(
      (group) => group[0]?.group === 'Western Conference'
    );

    return [easternConference, westernConference].filter(
      (group): group is StandingRanks[] => group !== undefined
    );
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
}

export interface StandingsReader {
  findByFilter(
    filter: Parameters<StandingsService['findByFilter']>[0],
    options?: Parameters<StandingsService['findByFilter']>[1]
  ): Promise<StandingsDTO | null>;
}
