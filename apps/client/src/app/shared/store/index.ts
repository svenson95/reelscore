import { FixturesStore } from './fixtures.store';
import { StandingsStore } from './standings.store';
import { WeekdayFixturesStore } from './weekday-fixtures.store';
import { WeekdayStandingsStore } from './weekday-standings.store';

export * from './fixtures.store';
export * from './standings.store';
export * from './weekday-fixtures.store';
export * from './weekday-standings.store';

export const GLOBAL_STORE_PROVIDERS = [
  StandingsStore,
  FixturesStore,
  WeekdayFixturesStore,
  WeekdayStandingsStore,
];
