import { FilteredStandingsStore } from './filtered-standings/filtered-standings.store';
import { WeekStandingsStore } from './week-standings/week-standings.store';

export const OVERVIEW_STORE_PROVIDERS = [
  FilteredStandingsStore,
  WeekStandingsStore,
];
