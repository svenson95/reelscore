import { FixturesStore } from './fixtures.store';
import { StandingsStore } from './standings.store';
import { TopFiveStandingsStore } from './top-five-standings.store';

export * from './fixtures.store';
export * from './standings.store';
export * from './top-five-standings.store';

export const GLOBAL_STORE_PROVIDERS = [
  StandingsStore,
  TopFiveStandingsStore,
  FixturesStore,
];
