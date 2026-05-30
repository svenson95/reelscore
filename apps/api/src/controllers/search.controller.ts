import type {
  CompetitionSearchResult,
  FixtureSearchResult,
  SearchResult,
  TeamSearchResult,
} from '@lib/models';

import { Fixtures, Teams } from '../models';
import { SearchService } from '../services';

export class SearchController {
  private searchService = new SearchService();

  async getBySearchTerm(searchTerm: string): Promise<SearchResult[]> {
    const normalizedSearchTerm = searchTerm.trim();

    if (!normalizedSearchTerm) {
      return [];
    }

    const MAX_RESULTS = 5;
    const teamRegex = this.searchService.createTeamSearchRegex(searchTerm);
    const competitionRegex = new RegExp(
      this.searchService.escapeRegex(searchTerm),
      'i'
    );

    const [fixtures, teams, competitions] = await Promise.all([
      Fixtures.find({
        $or: [
          { 'teams.home.name': teamRegex },
          { 'teams.away.name': teamRegex },
        ],
      })
        .sort({ 'fixture.timestamp': -1 })
        .limit(MAX_RESULTS)
        .lean(),

      Teams.find({
        'team.name': teamRegex,
      })
        .sort({ updatedAt: -1 })
        .limit(MAX_RESULTS)
        .lean(),

      Fixtures.aggregate([
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
      ]),
    ]);

    const fixtureResults: FixtureSearchResult[] = fixtures.map((fixture) => ({
      id: fixture.fixture?.id ?? String(fixture._id),
      type: 'fixtures',
      data: {
        fixture: fixture.fixture,
        league: fixture.league,
        teams: fixture.teams,
      },
    }));

    const teamResults: TeamSearchResult[] = teams.map((team) => ({
      id: team.team?.id ?? String(team._id),
      type: 'teams',
      data: {
        team: team.team,
      },
    }));

    const competitionResults: CompetitionSearchResult[] = competitions.map(
      ({ _id, league }) => ({
        id: _id,
        type: 'competitions',
        data: {
          league,
        },
      })
    );

    return [...fixtureResults, ...competitionResults, ...teamResults];
  }
}
