import moment from 'moment-timezone';

import type {
  CompetitionSearchResult,
  FixtureSearchResult,
  SearchResult,
  TeamSearchResult,
} from '@reelscore-sdk/models';

import { Fixtures, Teams } from '../database';

import { SearchService } from './search.service';

const MAX_RESULTS = 5;
const LAST_FIXTURE_COUNT = 4;

export class SearchController {
  private readonly searchService = new SearchService();

  async getBySearchTerm(searchTerm: string): Promise<SearchResult[]> {
    const normalizedSearchTerm = searchTerm.trim();

    if (!normalizedSearchTerm) {
      return [];
    }

    const nowTimestamp = moment().unix();
    const teamRegex = this.searchService.createTeamSearchRegex(searchTerm);
    const competitionRegex = new RegExp(
      this.searchService.escapeRegex(searchTerm),
      'i'
    );

    const [fixtureResults, competitionResults, teamResults] = await Promise.all(
      [
        this.searchFixtures(teamRegex, nowTimestamp),
        this.searchCompetitions(competitionRegex),
        this.searchTeams(teamRegex),
      ]
    );

    return [...fixtureResults, ...competitionResults, ...teamResults];
  }

  private async searchFixtures(
    teamRegex: RegExp,
    nowTimestamp: number
  ): Promise<FixtureSearchResult[]> {
    const teamMatchQuery = {
      $or: [{ 'teams.home.name': teamRegex }, { 'teams.away.name': teamRegex }],
    };
    const [recentFixtures, nextFixtures] = await Promise.all([
      Fixtures.find({
        ...teamMatchQuery,
        'fixture.timestamp': { $lte: nowTimestamp },
      })
        .sort({ 'fixture.timestamp': -1 })
        .limit(LAST_FIXTURE_COUNT)
        .lean(),

      Fixtures.find({
        ...teamMatchQuery,
        'fixture.timestamp': { $gt: nowTimestamp },
      })
        .sort({ 'fixture.timestamp': 1 })
        .limit(1)
        .lean(),
    ]);

    return [...nextFixtures, ...recentFixtures].map((fixture) => ({
      id: fixture.fixture?.id ?? String(fixture._id),
      type: 'fixtures',
      data: {
        fixture: fixture.fixture,
        league: fixture.league,
        teams: fixture.teams,
      },
    }));
  }

  private async searchTeams(teamRegex: RegExp): Promise<TeamSearchResult[]> {
    const teams = await Teams.find({
      'team.name': teamRegex,
    })
      .sort({ updatedAt: -1 })
      .limit(MAX_RESULTS)
      .lean();

    return teams.map((team) => ({
      id: team.team?.id ?? String(team._id),
      type: 'teams',
      data: {
        team: team.team,
      },
    }));
  }

  private async searchCompetitions(
    competitionRegex: RegExp
  ): Promise<CompetitionSearchResult[]> {
    const competitions = await Fixtures.aggregate([
      {
        $match: {
          'league.name': competitionRegex,
        },
      },
      {
        $sort: {
          'fixture.timestamp': -1,
        },
      },
      {
        $group: {
          _id: {
            $ifNull: ['$league.id', '$league.name'],
          },
          league: {
            $first: '$league',
          },
        },
      },
      {
        $limit: MAX_RESULTS,
      },
    ]);

    return competitions.map(({ _id, league }) => ({
      id: _id,
      type: 'competitions',
      data: {
        league,
      },
    }));
  }
}
