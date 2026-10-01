import type { ExtendedFixtureDTO } from '@reelscore-sdk/models';

import type { StandingsDTO } from './standings/standings.model';

type WeekData<T> = T[][];
export type FixturesWeekData = WeekData<ExtendedFixtureDTO>;
export type StandingsWeekData = WeekData<StandingsDTO>;
