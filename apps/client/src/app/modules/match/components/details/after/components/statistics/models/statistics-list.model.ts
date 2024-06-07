import { FixtureStatisticsResponse, StatisticItemValue } from '@lib/models';

export type StatisticListItem = {
  home: StatisticItemValue;
  away: StatisticItemValue;
};

export class StatisticList {
  static init(data: FixtureStatisticsResponse[]): StatisticList {
    return new StatisticList(data);
  }

  ballPossession!: StatisticListItem;
  shotsTotal!: StatisticListItem;
  shotsOnGoal!: StatisticListItem;
  shotsOffGoal!: StatisticListItem;
  cornerKicks!: StatisticListItem;
  fouls!: StatisticListItem;
  goalkeeperSaves!: StatisticListItem;
  offsides!: StatisticListItem;
  passesTotal!: StatisticListItem;
  passAccuracy!: StatisticListItem;
  yellowCards!: StatisticListItem;
  redCards!: StatisticListItem;

  constructor(data: FixtureStatisticsResponse[]) {
    const homeStats = data[0].statistics;
    const awayStats = data[1].statistics;

    homeStats.forEach((s, idx) => {
      const h = s.value;
      const a = awayStats[idx].value;

      if (s.type === 'Ball Possession') {
        this.ballPossession = this.setValue(h, a);
      }

      if (s.type === 'Total Shots') {
        this.shotsTotal = this.setValue(h, a);
      }

      if (s.type === 'Shots on Goal') {
        this.shotsOnGoal = this.setValue(h, a);
      }

      if (s.type === 'Shots off Goal') {
        this.shotsOffGoal = this.setValue(h, a);
      }

      if (s.type === 'Corner Kicks') {
        this.cornerKicks = this.setValue(h, a);
      }

      if (s.type === 'Fouls') {
        this.fouls = this.setValue(h, a);
      }

      if (s.type === 'Goalkeeper Saves') {
        this.goalkeeperSaves = this.setValue(h, a);
      }

      if (s.type === 'Offsides') {
        this.offsides = this.setValue(h, a);
      }

      if (s.type === 'Yellow Cards') {
        this.yellowCards = this.setValue(h, a);
      }

      if (s.type === 'Red Cards') {
        this.redCards = this.setValue(h, a);
      }

      if (s.type === 'Total passes') {
        this.passesTotal = this.setValue(h, a);
      }

      if (s.type === 'Passes %') {
        this.passAccuracy = this.setValue(h, a);
      }
    });
  }

  private setValue(
    home: StatisticItemValue,
    away: StatisticItemValue
  ): StatisticListItem {
    return {
      home: home ?? 0,
      away: away ?? 0,
    };
  }
}
