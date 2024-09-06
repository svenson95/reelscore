import { HTTP_LAST_FIXTURES_SERVICE_PROVIDER } from './last-fixtures.service';
import { HTTP_NEXT_FIXTURES_SERVICE_PROVIDER } from './next-fixtures.service';

export * from './last-fixtures.service';
export * from './next-fixtures.service';

export const SERVICE_PROVIDERS = [
  HTTP_LAST_FIXTURES_SERVICE_PROVIDER,
  HTTP_NEXT_FIXTURES_SERVICE_PROVIDER,
];
