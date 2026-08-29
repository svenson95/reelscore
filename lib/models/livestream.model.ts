import type { FixtureDTO, FixtureId } from './fixtures/fixture.model';
import type { RapidEventsDTO } from './rapid-dto.model';
import type { OperationResponse } from './response.model';

export const REALTIME_EVENT = {
  FIXTURES_UPDATED: 'fixtures.updated',
  FIXTURE_EVENTS_UPDATED: 'fixture.eventsUpdated',
} as const;

export type LiveFixtureUpdateDTO = {
  fixtureId: FixtureId;
  operation: OperationResponse<FixtureDTO>;
};

export type LiveFixturesUpdateDTO = {
  updates: LiveFixtureUpdateDTO[];
};

export type LiveFixtureEventsUpdateDTO = {
  fixtureId: FixtureId;
  operation: OperationResponse<RapidEventsDTO>;
};

export type LiveFixtureEventsBatchUpdateDTO = {
  updates: LiveFixtureEventsUpdateDTO[];
};
