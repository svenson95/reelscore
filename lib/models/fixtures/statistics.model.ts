export type TeamDetails = { id: number; name: string; logo: string };
export type StatisticItemType = string;
export type StatisticItemValue = string | number | null;
export type StatisticItem = {
  type: StatisticItemType;
  value: StatisticItemValue;
};
export type TeamStatistics = Array<StatisticItem>;
export interface StatisticDTO {
  team: TeamDetails;
  statistics: TeamStatistics;
}
