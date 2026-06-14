import type { TeamId, TeamLogo, TeamName } from '../team.model';

export type StatisticsTeamDetails = {
  id: TeamId;
  name: TeamName;
  logo: TeamLogo;
};

export type StatisticItemType =
  | 'Ball Possession'
  | 'Total Shots'
  | 'Shots on Goal'
  | 'Shots off Goal'
  | 'Corner Kicks'
  | 'Fouls'
  | 'Goalkeeper Saves'
  | 'Offsides'
  | 'Yellow Cards'
  | 'Red Cards'
  | 'Total passes'
  | 'Passes %';

type RequiredStatisticKey =
  | 'ballPossession'
  | 'shotsTotal'
  | 'shotsOnGoal'
  | 'shotsOffGoal'
  | 'cornerKicks'
  | 'fouls'
  | 'goalkeeperSaves'
  | 'offsides'
  | 'yellowCards'
  | 'redCards';

type OptionalStatisticKey = 'passesTotal' | 'passAccuracy';

export type StatisticKey = RequiredStatisticKey | OptionalStatisticKey;

export type StatisticItemValue = string | number | null;

export type StatisticItem = {
  type: StatisticItemType;
  value: StatisticItemValue;
};

export type TeamStatistics = StatisticItem[];

export interface StatisticDTO {
  team: StatisticsTeamDetails;
  statistics: TeamStatistics;
}
