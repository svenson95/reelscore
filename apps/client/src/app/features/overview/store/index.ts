import { FilteredStandingsStore } from './filtered-standings.store';
import { WeekdayFixturesStore } from './weekday-fixtures.store';
import { WeekdayStandingsStore } from './weekday-standings.store';

export * from './filtered-standings.store';
export * from './weekday-fixtures.store';
export * from './weekday-standings.store';

export const STORE_PROVIDERS = [
  FilteredStandingsStore,
  WeekdayFixturesStore,
  WeekdayStandingsStore,
];
