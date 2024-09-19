import {
  EvaluationTeam,
  FixtureDTO,
  FixturePerformance,
  FixtureResult,
  StatisticDTO,
  StatisticItem,
  StatisticItemType,
} from '@lib/models';
import { Fixtures, FixturesStatistics } from '../../models';
import { findLatestFixtures } from '../fixtures';

export const getFixtureEvaluations = async (req, res, next) => {
  const fixtureId = req.query.fixture;
  const fixture = await Fixtures.findOne({
    'fixture.id': fixtureId,
  });

  const homeLatest = await findLatestFixtures(fixture, 'home');
  const awayLatest = await findLatestFixtures(fixture, 'away');

  const { home, away } = fixture.teams;
  const homeAnalyzed = await analyzedFixtures(home.id, homeLatest);
  const awayAnalyzed = await analyzedFixtures(away.id, awayLatest);

  next({
    fixture: fixtureId,
    teams: {
      home: homeAnalyzed,
      away: awayAnalyzed,
    },
  });
};

const analyzedFixtures = async (
  teamId: number,
  fixtures: FixtureDTO[]
): Promise<EvaluationTeam> => {
  const performances = await analyzePerformances(teamId, fixtures);
  const results = await analyzeResults(teamId, fixtures);

  return {
    performances,
    results,
  };
};

const analyzeTeamPerformance = (
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
      if ((goals >= 2 && luckyGoals === 0) || (goals >= 3 && luckyGoals <= 1)) {
        return 'HIGH';
      } else {
        return 'MIDDLE';
      }
    } else {
      return 'LOW';
    }
  }
};

const analyzePerformances = async (
  teamId: number,
  fixtures: FixtureDTO[]
): Promise<FixturePerformance[]> | null => {
  const performances = fixtures.map(async (fixture) => {
    const stats = await FixturesStatistics.findOne({
      'parameters.fixture': fixture.fixture.id,
    }).lean();
    const teams = stats?.response;
    if (!stats || teams?.length === 0) return 'NO_STATISTICS_AVAILABLE';

    const { status } = fixture.fixture;
    const isUpcomingMatch = status.short === 'NS' || status.short === 'TBD';
    if (isUpcomingMatch) return 'MATCH_NOT_STARTED';

    const isMatchPostponed = status.short === 'PST';
    if (isMatchPostponed) return 'MATCH_POSTPONED';

    const teamIndex = teams[0].team.id === teamId ? 0 : 1;
    const statistics = teams[teamIndex] as StatisticDTO;
    return analyzeTeamPerformance(statistics, fixture);
  });
  while (performances.length < 5) {
    performances.push(Promise.resolve('NO_STATISTICS_AVAILABLE'));
  }
  return Promise.all(performances);
};

const analyzeResults = async (
  teamId: number,
  fixtures: FixtureDTO[]
): Promise<FixtureResult[]> => {
  const mapped = fixtures.map(async (fixture) => {
    return analyzeTeamResult(teamId, fixture);
  });
  while (mapped.length < 5) {
    mapped.push(Promise.resolve('NO_RESULT_AVAILABLE'));
  }
  return Promise.all(mapped);
};

const analyzeTeamResult = (
  teamId: number,
  fixture: FixtureDTO
): FixtureResult => {
  const team =
    teamId === fixture.teams.home.id ? fixture.teams.home : fixture.teams.away;
  const isWinner = team.winner;
  return isWinner === true ? 'WIN' : isWinner === false ? 'LOSS' : 'DRAW';
};
