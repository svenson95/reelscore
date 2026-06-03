import type { EventDTO } from './fixtures/events.model';
import type { FixtureId } from './fixtures/fixture.model';
import type { StatisticDTO } from './fixtures/statistics.model';

export type BaseParameters = { fixture: FixtureId };
export type BasePaging = { current: number; total: number };

export interface RapidDTO<T> {
  parameters: BaseParameters;
  errors: unknown[];
  paging: BasePaging;
  response: T[];
}

export type RapidEventsDTO = RapidDTO<EventDTO>;
export type RapidStatisticsDTO = RapidDTO<StatisticDTO>;
