import { LastFixturesStore } from './last-fixtures.store';
import { NextFixturesStore } from './next-fixtures.store';
import { CompetitionStandingsStore } from './standings.store';
import { TopScorersStore } from './top-scorers.store';

export * from './last-fixtures.store';
export * from './next-fixtures.store';
export * from './standings.store';
export * from './top-scorers.store';

export const STORE_PROVIDERS = [
  LastFixturesStore,
  NextFixturesStore,
  CompetitionStandingsStore,
  TopScorersStore,
];
