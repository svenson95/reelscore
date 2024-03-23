export interface FixtureStatistics {
  parameters: {
    fixture: string;
  };
  response: FixtureStatisticsResponse[];
}

export interface FixtureStatisticsResponse {
  team: {
    id: number;
    name: string;
    logo: string;
  };
  statistics: Array<{
    type: string;
    value: string | number | null;
  }>;
}
