import type {
  EvaluationTeam,
  FixtureDTO,
  FixtureIdParameter,
  FixturePerformance,
  FixtureResult,
  RapidStatisticsDTO,
  StatisticDTO,
  StatisticItemType,
} from '@reelscore-sdk/models';

import { FixtureStatisticsService } from '../database';

const EVALUATION_FIXTURE_COUNT = 5;

export interface FixtureStatisticsReader {
  findById(fixtureId: FixtureIdParameter): Promise<RapidStatisticsDTO | null>;
}

export class FixtureEvaluationsService {
  constructor(
    private readonly statisticsService: FixtureStatisticsReader = new FixtureStatisticsService()
  ) {}

  async analyzeFixtures(
    teamId: number,
    fixtures: FixtureDTO[]
  ): Promise<EvaluationTeam> {
    const [performances, results] = await Promise.all([
      this.analyzePerformances(teamId, fixtures),
      this.analyzeResults(teamId, fixtures),
    ]);

    return { performances, results };
  }

  private async analyzePerformances(
    teamId: number,
    fixtures: FixtureDTO[]
  ): Promise<FixturePerformance[]> {
    const performances = await Promise.all(
      fixtures.map((fixture) => this.analyzeFixturePerformance(teamId, fixture))
    );

    return this.padToFixtureCount(performances, 'NO_STATISTICS_AVAILABLE');
  }

  private async analyzeFixturePerformance(
    teamId: number,
    fixture: FixtureDTO
  ): Promise<FixturePerformance> {
    const fixtureId: FixtureIdParameter = fixture.fixture.id.toString();
    const stats = await this.statisticsService.findById(fixtureId);
    const teams = stats?.response;
    if (!teams?.length) return 'NO_STATISTICS_AVAILABLE';

    if (['TBD', 'NS'].includes(fixture.fixture.status.short)) {
      return 'MATCH_NOT_STARTED';
    }
    if (fixture.fixture.status.short === 'PST') return 'MATCH_POSTPONED';

    const statistics = teams.find(({ team }) => team.id === teamId);
    if (!statistics) return 'NO_STATISTICS_AVAILABLE';

    return this.analyzeTeamPerformance(statistics, fixture);
  }

  private analyzeTeamPerformance(
    data: StatisticDTO,
    fixture: FixtureDTO
  ): FixturePerformance {
    const statisticValue = (type: StatisticItemType): number => {
      const statistic = data.statistics.find((item) => item.type === type);
      if (!statistic) throw new Error(`Statistic ${type} not found`);
      return Number(statistic.value);
    };

    const shotsOnGoal = statisticValue('Shots on Goal');
    const shotsTotal = statisticValue('Total Shots');
    const goals =
      data.team.id === fixture.teams.home.id
        ? fixture.goals.home
        : fixture.goals.away;
    if (goals === null) throw new Error('Fixture has no goals');

    if (statisticValue('Ball Possession') === 0) {
      return 'NO_STATISTICS_AVAILABLE';
    }

    const hasManyShots = shotsOnGoal >= 8 && shotsTotal >= 12;
    if (hasManyShots) return goals >= 2 ? 'HIGH' : 'MIDDLE';

    const hasSomeShots = shotsOnGoal >= 4 && shotsTotal >= 8;
    if (!hasSomeShots) return 'LOW';

    return goals >= 2 ? 'HIGH' : 'MIDDLE';
  }

  private analyzeResults(
    teamId: number,
    fixtures: FixtureDTO[]
  ): FixtureResult[] {
    const results = fixtures.map((fixture) =>
      this.analyzeTeamResult(teamId, fixture)
    );

    return this.padToFixtureCount(results, 'NO_RESULT_AVAILABLE');
  }

  private analyzeTeamResult(
    teamId: number,
    fixture: FixtureDTO
  ): FixtureResult {
    const { home: homeGoals, away: awayGoals } = fixture.goals;
    if (homeGoals === null || awayGoals === null) {
      return 'NO_RESULT_AVAILABLE';
    }
    if (homeGoals === awayGoals) return 'DRAW';

    const isHomeTeam = teamId === fixture.teams.home.id;
    const teamGoals = isHomeTeam ? homeGoals : awayGoals;
    const opponentGoals = isHomeTeam ? awayGoals : homeGoals;
    return teamGoals > opponentGoals ? 'WIN' : 'LOSS';
  }

  private padToFixtureCount<T>(items: T[], fallback: T): T[] {
    return [
      ...items,
      ...Array<T>(Math.max(0, EVALUATION_FIXTURE_COUNT - items.length)).fill(
        fallback
      ),
    ];
  }
}
