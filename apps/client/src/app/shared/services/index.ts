import { BREAKPOINT_OBSERVER_SERVICE_PROVIDER } from './breakpoint-observer.service';
import { DATE_SERVICE_PROVIDER } from './date.service';
import { FILTER_SERVICE_PROVIDER } from './filter.service';
import { HTTP_FIXTURES_SERVICE_PROVIDER } from './http/fixtures.service';
import { HTTP_STANDINGS_SERVICE_PROVIDER } from './http/standings.service';
import { LEAGUE_SERVICE_PROVIDER } from './league/league.service';
import { ROUTE_SERVICE_PROVIDER } from './route.service';

export * from './breakpoint-observer.service';
export * from './date.service';
export * from './filter.service';
export * from './http/fixtures.service';
export * from './http/standings.service';
export * from './league/league.service';
export * from './route-reuse.provider';
export * from './route.service';

export const GLOBAL_SERVICE_PROVIDERS = [
  BREAKPOINT_OBSERVER_SERVICE_PROVIDER,
  DATE_SERVICE_PROVIDER,
  LEAGUE_SERVICE_PROVIDER,
  FILTER_SERVICE_PROVIDER,
  ROUTE_SERVICE_PROVIDER,
  HTTP_STANDINGS_SERVICE_PROVIDER,
  HTTP_FIXTURES_SERVICE_PROVIDER,
];
