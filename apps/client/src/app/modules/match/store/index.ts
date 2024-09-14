import { EvaluationsStore } from './evaluations.store';
import { EventsStore } from './events.store';
import { FixtureStore } from './fixture.store';
import { LatestFixturesStore } from './latest-fixtures.store';
import { StatisticsStore } from './statistics.store';

export * from './evaluations.store';
export * from './events.store';
export * from './fixture.store';
export * from './latest-fixtures.store';
export * from './statistics.store';

export const STORE_PROVIDERS = [
  FixtureStore,
  LatestFixturesStore,
  EventsStore,
  StatisticsStore,
  EvaluationsStore,
];
