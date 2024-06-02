import { FixtureId } from './fixture.model';

export interface FixtureStatisticsDTO {
  parameters: {
    fixture: FixtureId;
  };
  response: FixtureStatisticsResponse[];
}

export type StatisticItemValue = string | number | null;

export interface StatisticItem {
  type: string;
  value: StatisticItemValue;
}

export interface TeamDetails {
  id: number;
  name: string;
  logo: string;
}

export interface FixtureStatisticsResponse {
  team: TeamDetails;
  statistics: Array<StatisticItem>;
}
