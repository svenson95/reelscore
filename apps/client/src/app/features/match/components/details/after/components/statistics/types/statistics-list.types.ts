import type {
  StatisticDTO,
  StatisticItemType,
  StatisticItemValue,
  StatisticKey,
} from '@reelscore-sdk/models';

export type StatisticListItem = {
  home: StatisticItemValue | undefined;
  away: StatisticItemValue | undefined;
};

const statisticKeysByType = {
  'Ball Possession': 'ballPossession',
  'Total Shots': 'shotsTotal',
  'Shots on Goal': 'shotsOnGoal',
  'Shots off Goal': 'shotsOffGoal',
  'Corner Kicks': 'cornerKicks',
  Fouls: 'fouls',
  'Goalkeeper Saves': 'goalkeeperSaves',
  Offsides: 'offsides',
  'Yellow Cards': 'yellowCards',
  'Red Cards': 'redCards',
  'Total passes': 'passesTotal',
  'Passes %': 'passAccuracy',
} as const satisfies Record<StatisticItemType, StatisticKey>;

export class StatisticList {
  ballPossession?: StatisticListItem;
  shotsTotal?: StatisticListItem;
  shotsOnGoal?: StatisticListItem;
  shotsOffGoal?: StatisticListItem;
  cornerKicks?: StatisticListItem;
  fouls?: StatisticListItem;
  goalkeeperSaves?: StatisticListItem;
  offsides?: StatisticListItem;
  yellowCards?: StatisticListItem;
  redCards?: StatisticListItem;
  passesTotal?: StatisticListItem;
  passAccuracy?: StatisticListItem;

  static init(data: StatisticDTO[]): StatisticList {
    return new StatisticList(data);
  }

  constructor(data: StatisticDTO[]) {
    const homeStatistics = data[0]?.statistics ?? [];

    const awayStatistics = data[1]?.statistics ?? [];
    const awayStatisticValuesByType = new Map(
      awayStatistics.map((statistic) => [statistic.type, statistic.value])
    );

    for (const homeStatistic of homeStatistics) {
      const statisticKey = statisticKeysByType[homeStatistic.type];
      const awayValue =
        awayStatisticValuesByType.get(homeStatistic.type) ?? null;

      this[statisticKey] = { home: homeStatistic.value, away: awayValue };
    }
  }
}
