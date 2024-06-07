import { FIXTURE_EVENTS_SERVICE_PROVIDER } from './fixture-events/fixture-events.service';
import { HTTP_FIXTURE_EVENTS_SERVICE_PROVIDER } from './fixture-events/http.service';
import { FIXTURE_STATISTICS_SERVICE_PROVIDER } from './fixture-statistics/fixture-statistics.service';
import { HTTP_FIXTURE_STATISTICS_SERVICE_PROVIDER } from './fixture-statistics/http.service';
import { FIXTURE_SERVICE_PROVIDER } from './fixture/fixture.service';
import { HTTP_FIXTURE_SERVICE_PROVIDER } from './fixture/http.service';
import { FIXTURES_SERVICE_PROVIDER } from './fixtures/fixtures.service';
import { HTTP_FIXTURES_SERVICE_PROVIDER } from './fixtures/http.service';

export * from './fixture-events/fixture-events.service';
export * from './fixture-events/http.service';
export * from './fixture-statistics/fixture-statistics.service';
export * from './fixture-statistics/http.service';
export * from './fixture/fixture.service';
export * from './fixture/http.service';
export * from './fixtures/fixtures.service';
export * from './fixtures/http.service';

export const SERVICE_PROVIDERS = [
  HTTP_FIXTURE_SERVICE_PROVIDER,
  HTTP_FIXTURE_EVENTS_SERVICE_PROVIDER,
  HTTP_FIXTURE_STATISTICS_SERVICE_PROVIDER,
  HTTP_FIXTURES_SERVICE_PROVIDER,
  FIXTURE_SERVICE_PROVIDER,
  FIXTURE_EVENTS_SERVICE_PROVIDER,
  FIXTURE_STATISTICS_SERVICE_PROVIDER,
  FIXTURES_SERVICE_PROVIDER,
];
