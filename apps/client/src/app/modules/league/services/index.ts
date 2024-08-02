import { HTTP_STANDINGS_SERVICE_PROVIDER } from './standings/http.service';
import { STANDINGS_SERVICE_PROVIDER } from './standings/standings.service';

export * from './standings/http.service';
export * from './standings/standings.service';

export const SERVICE_PROVIDERS = [
  HTTP_STANDINGS_SERVICE_PROVIDER,
  STANDINGS_SERVICE_PROVIDER,
];
