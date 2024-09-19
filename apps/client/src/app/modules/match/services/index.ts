import { FIXTURE_SERVICE_PROVIDER } from './fixture/fixture.service';
import { HTTP_FIXTURE_ANALYSES_SERVICE_PROVIDER } from './http/analyses.service';
import { HTTP_EVALUATIONS_SERVICE_PROVIDER } from './http/evaluation.service';
import { HTTP_FIXTURE_EVENTS_SERVICE_PROVIDER } from './http/events.service';
import { HTTP_FIXTURE_SERVICE_PROVIDER } from './http/fixture.service';
import { HTTP_LATEST_FIXTURES_SERVICE_PROVIDER } from './http/latest-fixtures.service';
import { HTTP_FIXTURE_STANDINGS_SERVICE_PROVIDER } from './http/standings.service';
import { HTTP_FIXTURE_STATISTICS_SERVICE_PROVIDER } from './http/statistics.service';

export * from './fixture/fixture.service';
export * from './http/analyses.service';
export * from './http/evaluation.service';
export * from './http/events.service';
export * from './http/fixture.service';
export * from './http/latest-fixtures.service';
export * from './http/standings.service';
export * from './http/statistics.service';

export const SERVICE_PROVIDERS = [
  FIXTURE_SERVICE_PROVIDER,
  HTTP_FIXTURE_SERVICE_PROVIDER,
  HTTP_EVALUATIONS_SERVICE_PROVIDER,
  HTTP_FIXTURE_EVENTS_SERVICE_PROVIDER,
  HTTP_LATEST_FIXTURES_SERVICE_PROVIDER,
  HTTP_FIXTURE_ANALYSES_SERVICE_PROVIDER,
  HTTP_FIXTURE_STANDINGS_SERVICE_PROVIDER,
  HTTP_FIXTURE_STATISTICS_SERVICE_PROVIDER,
];
