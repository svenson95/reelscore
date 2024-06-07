import { FIXTURES_SERVICE_PROVIDER } from './fixtures/fixtures.service';
import { HTTP_FIXTURES_SERVICE_PROVIDER } from './fixtures/http.service';
import { HTTP_STANDINGS_SERVICE_PROVIDER } from './standings/http.service';
import { STANDINGS_SERVICE_PROVIDER } from './standings/standings.service';

export * from './fixtures/fixtures.service';
export * from './fixtures/http.service';
export * from './standings/http.service';
export * from './standings/standings.service';

export const SERVICE_PROVIDERS = [
  HTTP_STANDINGS_SERVICE_PROVIDER,
  HTTP_FIXTURES_SERVICE_PROVIDER,
  STANDINGS_SERVICE_PROVIDER,
  FIXTURES_SERVICE_PROVIDER,
];
