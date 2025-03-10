import {
  EvaluationDTO,
  EvaluationTeam,
  FixtureDTO,
  FixtureId,
  FixturePerformance,
  FixtureResult,
  StatisticDTO,
  StatisticItem,
  StatisticItemType,
} from '@lib/models';

import {
  FixtureService,
  FixturesService,
  FixtureStatisticsService,
} from '../../services';

export class FixtureEvaluationsController {
  private fixtureService = new FixtureService();
  private fixturesService = new FixturesService();
  private statisticsService = new FixtureStatisticsService();

  async getEvaluations(fixtureId: FixtureId): Promise<EvaluationDTO> {
    const fixture = await this.fixtureService.findById(fixtureId);

    const homeLatest = await this.fixturesService.findByFixtureAndTeamType(
      fixture,
      'home'
    );
    const awayLatest = await this.fixturesService.findByFixtureAndTeamType(
      fixture,
      'away'
    );

    const { home, away } = fixture.teams;
    const homeAnalyzed = await this.analyzedFixtures(home.id, homeLatest);
    const awayAnalyzed = await this.analyzedFixtures(away.id, awayLatest);

    return {
      fixture: fixtureId,
      teams: {
        home: homeAnalyzed,
        away: awayAnalyzed,
      },
    };
  }

  private analyzedFixtures = async (
    teamId: number,
    fixtures: FixtureDTO[]
  ): Promise<EvaluationTeam> => {
    const performances = await this.analyzePerformances(teamId, fixtures);
    const results = await this.analyzeResults(teamId, fixtures);

    return {
      performances,
      results,
    };
  };

  private analyzeTeamPerformance = (
    data: StatisticDTO,
    fixture: FixtureDTO
  ): FixturePerformance => {
    const statistic = (type: StatisticItemType) => {
      const stats = data.statistics.find((s: StatisticItem) => s.type === type);
      if (!stats) throw new Error(`Statistic ${type} not found`);
      return stats;
    };

    const find = (type: StatisticItemType) => Number(statistic(type).value);
    const shotsOnGoal = find('Shots on Goal');
    const shotsTotal = find('Total Shots');
    const goals =
      data.team.id === fixture.teams.home.id
        ? fixture.goals.home
        : fixture.goals.away;
    if (goals === null) throw new Error('Fixture has no goals');

    const hasStatistics = find('Ball Possession') !== 0;
    if (!hasStatistics) return 'NO_STATISTICS_AVAILABLE';

    // const isLuckyGoal = (a: FixtureAnalysis) =>
    //   a.level === 'GOOD' && a.type === 'GOAL';
    const luckyGoals = 0;
    // const luckyGoals = evaluation.analyses.filter((a: FixtureAnalysis) =>
    //   isLuckyGoal(a)
    // ).length;

    if (shotsOnGoal >= 8 && shotsTotal >= 12) {
      if (goals >= 2 && luckyGoals <= 1) {
        return 'HIGH';
      } else {
        return 'MIDDLE';
      }
    } else {
      if (shotsOnGoal >= 4 && shotsTotal >= 8) {
        if (
          (goals >= 2 && luckyGoals === 0) ||
          (goals >= 3 && luckyGoals <= 1)
        ) {
          return 'HIGH';
        } else {
          return 'MIDDLE';
        }
      } else {
        return 'LOW';
      }
    }
  };

  private analyzePerformances = async (
    teamId: number,
    fixtures: FixtureDTO[]
  ): Promise<FixturePerformance[]> | null => {
    const performances = fixtures.map(async (fixture) => {
      const stats = await this.statisticsService.findById(fixture.fixture.id);
      const teams = stats?.response;
      if (!stats || teams?.length === 0) return 'NO_STATISTICS_AVAILABLE';

      const { status } = fixture.fixture;
      const notStartedValues = ['TBD', 'NS'];
      const isUpcomingMatch = notStartedValues.some(
        (v) => v === fixture.fixture.status.short
      );
      if (isUpcomingMatch) return 'MATCH_NOT_STARTED';

      const isMatchPostponed = status.short === 'PST';
      if (isMatchPostponed) return 'MATCH_POSTPONED';

      const teamIndex = teams[0].team.id === teamId ? 0 : 1;
      const statistics = teams[teamIndex] as StatisticDTO;
      return this.analyzeTeamPerformance(statistics, fixture);
    });
    while (performances.length < 5) {
      performances.push(Promise.resolve('NO_STATISTICS_AVAILABLE'));
    }
    return Promise.all(performances);
  };

  private analyzeResults = async (
    teamId: number,
    fixtures: FixtureDTO[]
  ): Promise<FixtureResult[]> => {
    const mapped = fixtures.map(async (fixture) => {
      return this.analyzeTeamResult(teamId, fixture);
    });
    while (mapped.length < 5) {
      mapped.push(Promise.resolve('NO_RESULT_AVAILABLE'));
    }
    return Promise.all(mapped);
  };

  private analyzeTeamResult = (
    teamId: number,
    fixture: FixtureDTO
  ): FixtureResult => {
    const team =
      teamId === fixture.teams.home.id
        ? fixture.teams.home
        : fixture.teams.away;
    const isWinner = team.winner;
    return isWinner === true ? 'WIN' : isWinner === false ? 'LOSS' : 'DRAW';
  };
}
