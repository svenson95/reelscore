import { FIXTURE_SERVICE_PROVIDER } from './fixture/fixture.service';
import { HTTP_EVALUATIONS_SERVICE_PROVIDER } from './http/evaluation.service';
import { HTTP_FIXTURE_EVENTS_SERVICE_PROVIDER } from './http/events.service';
import { HTTP_LATEST_FIXTURES_SERVICE_PROVIDER } from './http/latest-fixtures.service';
import { HTTP_FIXTURE_METRICS_SERVICE_PROVIDER } from './http/metrics.service';
import { HTTP_FIXTURE_STATISTICS_SERVICE_PROVIDER } from './http/statistics.service';

export * from './fixture/fixture.service';
export * from './http/evaluation.service';
export * from './http/events.service';
export * from './http/latest-fixtures.service';
export * from './http/metrics.service';
export * from './http/statistics.service';

export const SERVICE_PROVIDERS = [
  HTTP_EVALUATIONS_SERVICE_PROVIDER,
  HTTP_FIXTURE_EVENTS_SERVICE_PROVIDER,
  HTTP_FIXTURE_STATISTICS_SERVICE_PROVIDER,
  HTTP_LATEST_FIXTURES_SERVICE_PROVIDER,
  HTTP_FIXTURE_METRICS_SERVICE_PROVIDER,
  FIXTURE_SERVICE_PROVIDER,
];
