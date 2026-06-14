import type {
  StatisticDTO,
  StatisticItemType,
  StatisticItemValue,
  StatisticKey,
} from '@lib/models';

export type StatisticListItem = {
  home: StatisticItemValue | undefined;
  away: StatisticItemValue | undefined;
};

const statisticTypeMap = {
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
    const homeStats = data[0]?.statistics ?? [];

    const awayStatsByType = new Map(
      (data[1]?.statistics ?? []).map((stat) => [stat.type, stat])
    );

    homeStats.forEach((homeStat) => {
      const key = statisticTypeMap[homeStat.type];

      this[key] = this.createValue(
        homeStat.value,
        awayStatsByType.get(homeStat.type)?.value
      );
    });
  }

  private createValue(
    home: StatisticItemValue | undefined,
    away: StatisticItemValue | undefined
  ): StatisticListItem {
    return {
      home: home ? home : -1,
      away: away ? away : -1,
    };
  }
}
