import { TeamId, TeamLogo, TeamName } from '../team.model';

export type StatisticsTeamDetails = {
  id: TeamId;
  name: TeamName;
  logo: TeamLogo;
};
export type StatisticItemType = string;
export type StatisticItemValue = string | number | null;
export type StatisticItem = {
  type: StatisticItemType;
  value: StatisticItemValue;
};
export type TeamStatistics = Array<StatisticItem>;
export interface StatisticDTO {
  team: StatisticsTeamDetails;
  statistics: TeamStatistics;
}
