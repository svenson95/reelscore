import { FixtureId } from './fixture.model';

export interface FixtureStatisticsDTO {
  parameters: {
    fixture: FixtureId;
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
