import type {
  FixtureDTO,
  RapidStatisticsDTO,
  StatisticDTO,
  StatisticItemType,
} from '@reelscore-sdk/models';

import {
  FixtureEvaluationsService,
  type FixtureStatisticsReader,
} from './fixture-evaluations.service';

const fixture = (
  homeGoals: number | null,
  awayGoals: number | null,
  status = 'FT'
): FixtureDTO =>
  ({
    fixture: { id: 10, status: { short: status } },
    teams: { home: { id: 1 }, away: { id: 2 } },
    goals: { home: homeGoals, away: awayGoals },
  } as FixtureDTO);

const statistics = (
  teamId: number,
  values: Record<StatisticItemType, number>
): StatisticDTO =>
  ({
    team: { id: teamId },
    statistics: Object.entries(values).map(([type, value]) => ({
      type,
      value,
    })),
  } as StatisticDTO);

describe(FixtureEvaluationsService.name, () => {
  it('evaluates performance and result and pads both histories to five entries', async () => {
    const response = [
      statistics(2, {
        'Shots on Goal': 1,
        'Total Shots': 2,
        'Ball Possession': 45,
      } as Record<StatisticItemType, number>),
      statistics(1, {
        'Shots on Goal': 8,
        'Total Shots': 12,
        'Ball Possession': 55,
      } as Record<StatisticItemType, number>),
    ];
    const statisticsReader: FixtureStatisticsReader = {
      findById: jest.fn().mockResolvedValue({ response } as RapidStatisticsDTO),
    };

    const result = await new FixtureEvaluationsService(
      statisticsReader
    ).analyzeFixtures(1, [fixture(2, 0)]);

    expect(statisticsReader.findById).toHaveBeenCalledWith('10');
    expect(result.performances).toEqual([
      'HIGH',
      'NO_STATISTICS_AVAILABLE',
      'NO_STATISTICS_AVAILABLE',
      'NO_STATISTICS_AVAILABLE',
      'NO_STATISTICS_AVAILABLE',
    ]);
    expect(result.results).toEqual([
      'WIN',
      'NO_RESULT_AVAILABLE',
      'NO_RESULT_AVAILABLE',
      'NO_RESULT_AVAILABLE',
      'NO_RESULT_AVAILABLE',
    ]);
  });

  it('returns unavailable values when statistics and a result are missing', async () => {
    const statisticsReader: FixtureStatisticsReader = {
      findById: jest.fn().mockResolvedValue(null),
    };

    const result = await new FixtureEvaluationsService(
      statisticsReader
    ).analyzeFixtures(1, [fixture(null, null)]);

    expect(result.performances[0]).toBe('NO_STATISTICS_AVAILABLE');
    expect(result.results[0]).toBe('NO_RESULT_AVAILABLE');
  });

  it.each([
    ['not started', 'NS', 'MATCH_NOT_STARTED'],
    ['undetermined', 'TBD', 'MATCH_NOT_STARTED'],
    ['postponed', 'PST', 'MATCH_POSTPONED'],
  ])(
    'returns the right performance for a %s fixture',
    async (_, status, expected) => {
      const statisticsReader: FixtureStatisticsReader = {
        findById: jest.fn().mockResolvedValue({
          response: [
            statistics(1, {
              'Shots on Goal': 5,
              'Total Shots': 9,
              'Ball Possession': 50,
            } as Record<StatisticItemType, number>),
          ],
        } as RapidStatisticsDTO),
      };

      const result = await new FixtureEvaluationsService(
        statisticsReader
      ).analyzeFixtures(1, [fixture(1, 0, status)]);

      expect(result.performances[0]).toBe(expected);
    }
  );

  it.each([
    [8, 12, 1, 'MIDDLE'],
    [4, 8, 1, 'MIDDLE'],
    [3, 7, 0, 'LOW'],
    [4, 8, 2, 'HIGH'],
  ])(
    'classifies performance for %i shots on goal, %i total shots and %i goals',
    async (shotsOnGoal, shotsTotal, goals, expected) => {
      const statisticsReader: FixtureStatisticsReader = {
        findById: jest.fn().mockResolvedValue({
          response: [
            statistics(1, {
              'Shots on Goal': shotsOnGoal,
              'Total Shots': shotsTotal,
              'Ball Possession': 50,
            } as Record<StatisticItemType, number>),
          ],
        } as RapidStatisticsDTO),
      };

      const result = await new FixtureEvaluationsService(
        statisticsReader
      ).analyzeFixtures(1, [fixture(goals, 0)]);

      expect(result.performances[0]).toBe(expected);
    }
  );

  it('treats zero possession as missing performance data', async () => {
    const statisticsReader: FixtureStatisticsReader = {
      findById: jest.fn().mockResolvedValue({
        response: [
          statistics(1, {
            'Shots on Goal': 8,
            'Total Shots': 12,
            'Ball Possession': 0,
          } as Record<StatisticItemType, number>),
        ],
      } as RapidStatisticsDTO),
    };

    const result = await new FixtureEvaluationsService(
      statisticsReader
    ).analyzeFixtures(1, [fixture(2, 0)]);

    expect(result.performances[0]).toBe('NO_STATISTICS_AVAILABLE');
  });

  it.each([
    [1, 2, 2, 'DRAW'],
    [1, 1, 2, 'LOSS'],
    [2, 1, 2, 'WIN'],
  ])(
    'returns %s team result for %i-%i goals',
    async (teamId, homeGoals, awayGoals, expected) => {
      const statisticsReader: FixtureStatisticsReader = {
        findById: jest.fn().mockResolvedValue(null),
      };

      const result = await new FixtureEvaluationsService(
        statisticsReader
      ).analyzeFixtures(teamId, [fixture(homeGoals, awayGoals)]);

      expect(result.results[0]).toBe(expected);
    }
  );

  it('returns unavailable performances when fixture statistics are missing', async () => {
    const statisticsReader: FixtureStatisticsReader = {
      findById: jest.fn().mockResolvedValue(null),
    };

    await expect(
      new FixtureEvaluationsService(
        statisticsReader
      ).analyzeFixturePerformances(fixture(1, 0))
    ).resolves.toEqual({
      home: 'NO_STATISTICS_AVAILABLE',
      away: 'NO_STATISTICS_AVAILABLE',
    });

    expect(statisticsReader.findById).toHaveBeenCalledWith('10');
  });

  it('analyzes performances for both teams from one fixture statistics response', async () => {
    const response = [
      statistics(1, {
        'Shots on Goal': 3,
        'Total Shots': 7,
        'Ball Possession': 42,
      } as Record<StatisticItemType, number>),
      statistics(2, {
        'Shots on Goal': 8,
        'Total Shots': 12,
        'Ball Possession': 58,
      } as Record<StatisticItemType, number>),
    ];
    const statisticsReader: FixtureStatisticsReader = {
      findById: jest.fn().mockResolvedValue({ response } as RapidStatisticsDTO),
    };

    await expect(
      new FixtureEvaluationsService(
        statisticsReader
      ).analyzeFixturePerformances(fixture(0, 2))
    ).resolves.toEqual({ home: 'LOW', away: 'HIGH' });
  });
});
