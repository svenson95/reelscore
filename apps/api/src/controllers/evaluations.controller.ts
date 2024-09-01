import {
  EvaluationTeam,
  FixtureDTO,
  FixturePerformance,
  FixtureResult,
  StatisticDTO,
  StatisticItem,
  StatisticItemType,
} from '@lib/models';
import { Fixtures, FixturesStatistics } from '../models';
import { findLatestFixturesForTeam } from './fixtures.controller';

export const getFixtureEvaluations = async (req, res, next) => {
  const fixtureId = req.query.fixture;
  const fixtureDoc = await Fixtures.findOne({
    'fixture.id': fixtureId,
  });

  const homeFixtures = await findLatestFixturesForTeam(
    fixtureDoc.teams.home.id,
    fixtureDoc.fixture.date
  );

  const awayFixtures = await findLatestFixturesForTeam(
    fixtureDoc.teams.away.id,
    fixtureDoc.fixture.date
  );

  if (homeFixtures.length === 0 && awayFixtures.length === 0) {
    return next(null);
  }

  const analyzedFixtures = async (
    fixtures: FixtureDTO[],
    teamId: number
  ): Promise<EvaluationTeam> => {
    const performances = await analyzePerformances(teamId, fixtures);
    const results = await analyzeResults(teamId, fixtures);

    return {
      performances,
      results,
    };
  };

  const home = await analyzedFixtures(homeFixtures, fixtureDoc.teams.home.id);
  const away = await analyzedFixtures(awayFixtures, fixtureDoc.teams.away.id);

  next({
    fixture: fixtureId,
    teams: {
      home,
      away,
    },
  });
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

  if (shotsOnGoal >= 6 && shotsTotal >= 10) {
    if (goals >= 2 && luckyGoals <= 1) {
      return 'HIGH';
    } else {
      return 'MIDDLE';
    }
  } else {
    if (shotsOnGoal >= 3 && shotsTotal >= 5) {
      if (goals > 1 && luckyGoals <= 0) {
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
    const { status } = fixture.fixture;
    const isUpcomingMatch = status.short === 'NS' || status.short === 'TBD';
    if (isUpcomingMatch) return 'MATCH_NOT_STARTED';

    const isMatchPostponed = fixture.fixture.status.short === 'PST';
    if (isMatchPostponed) return 'MATCH_POSTPONED';

    const teams = stats.response;
    if (teams.length === 0) return 'NO_STATISTICS_AVAILABLE';

    const teamIndex = teams[0].team.id === teamId ? 0 : 1;
    const statistics = teams[teamIndex] as StatisticDTO;
    return analyzeTeamPerformance(statistics, fixture);
  });
  return Promise.all(performances);
};

const analyzeResults = async (
  teamId: number,
  fixtures: FixtureDTO[]
): Promise<FixtureResult[]> => {
  const mapped = fixtures.map(async (fixture) => {
    return analyzeTeamResult(teamId, fixture);
  });
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
