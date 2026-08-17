import { FilteredStandingsStore } from './filtered-standings.store';
import { WeekFixturesStore } from './week-fixtures.store';
import { WeekStandingsStore } from './week-standings.store';

export * from './filtered-standings.store';
export * from './week-fixtures.store';
export * from './week-standings.store';

export const STORE_PROVIDERS = [
  FilteredStandingsStore,
  WeekFixturesStore,
  WeekStandingsStore,
];
