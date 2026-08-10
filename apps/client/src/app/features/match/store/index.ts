import { AnalysesStore } from './analyses.store';
import { EvaluationsStore } from './evaluations.store';
import { EventsStore } from './events.store';
import { FixtureStore } from './fixture.store';
import { LatestFixturesStore } from './latest-fixtures.store';
import { FixtureStandingsStore } from './standings.store';
import { StatisticsStore } from './statistics.store';

export * from './analyses.store';
export * from './evaluations.store';
export * from './events.store';
export * from './fixture.store';
export * from './latest-fixtures.store';
export * from './standings.store';
export * from './statistics.store';

export const STORE_PROVIDERS = [
  EvaluationsStore,
  EventsStore,
  FixtureStore,
  LatestFixturesStore,
  AnalysesStore,
  FixtureStandingsStore,
  StatisticsStore,
];
