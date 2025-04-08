import { BREAKPOINT_OBSERVER_SERVICE_PROVIDER } from './breakpoint-observer.service';
import { HTTP_WEEK_FIXTURES_SERVICE_PROVIDER } from './http/fixtures.service';
import { HTTP_STANDINGS_SERVICE_PROVIDER } from './http/standings.service';
import { LEAGUE_SERVICE_PROVIDER } from './league/league.service';
import { HTTP_INTERCEPTOR_PROVIDER } from './loading.interceptor';
import { LOADING_SERVICE_PROVIDER } from './loading.service';
import { ROUTE_SERVICE_PROVIDER } from './route.service';

export * from './breakpoint-observer.service';
export * from './http/fixtures.service';
export * from './http/standings.service';
export * from './league/league.service';
export * from './loading.interceptor';
export * from './loading.service';
export * from './route.service';

export const GLOBAL_SERVICE_PROVIDERS = [
  BREAKPOINT_OBSERVER_SERVICE_PROVIDER,
  LEAGUE_SERVICE_PROVIDER,
  LOADING_SERVICE_PROVIDER,
  HTTP_INTERCEPTOR_PROVIDER,
  ROUTE_SERVICE_PROVIDER,
  HTTP_STANDINGS_SERVICE_PROVIDER,
  HTTP_WEEK_FIXTURES_SERVICE_PROVIDER,
];
