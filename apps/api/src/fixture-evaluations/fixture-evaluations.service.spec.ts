import type { FixtureDTO } from '@reelscore-sdk/models';

import type {
  RapidStatisticsDTO,
  StatisticDTO,
  StatisticItemType,
} from '@lib/models';

import {
  FixtureEvaluationsService,
  type FixtureStatisticsReader,
} from './fixture-evaluations.service';

const fixture = (
  homeGoals: number | null,
  awayGoals: number | null
): FixtureDTO =>
  ({
    fixture: { id: 10, status: { short: 'FT' } },
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
});
