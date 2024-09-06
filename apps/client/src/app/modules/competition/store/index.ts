import { LastFixturesStore } from './last-fixtures.store';
import { NextFixturesStore } from './next-fixtures.store';

export * from './last-fixtures.store';
export * from './next-fixtures.store';

export const STORE_PROVIDERS = [LastFixturesStore, NextFixturesStore];
