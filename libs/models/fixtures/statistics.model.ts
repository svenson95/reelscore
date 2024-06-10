import { BaseDTO } from '../base-dto.model';

export type TeamDetails = { id: number; name: string; logo: string };
export type StatisticItemValue = string | number | null;
export type StatisticItem = { type: string; value: StatisticItemValue };
export interface StatisticsResponse {
  team: TeamDetails;
  statistics: Array<StatisticItem>;
}
export type StatisticsDTO = BaseDTO<StatisticsResponse>;
