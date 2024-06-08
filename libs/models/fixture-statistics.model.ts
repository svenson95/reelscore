import { BaseDTO } from './base-dto.model';

export type StatisticItemValue = string | number | null;
export type StatisticItem = { type: string; value: StatisticItemValue };
export type TeamDetails = { id: number; name: string; logo: string };

export type FixtureStatisticsDTO = BaseDTO<FixtureStatisticsResponse>;
export interface FixtureStatisticsResponse {
  team: TeamDetails;
  statistics: Array<StatisticItem>;
}
