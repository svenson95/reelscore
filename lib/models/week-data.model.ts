import { ExtendedFixtureDTO } from './fixtures';
import { StandingsDTO } from './standings/standings.model';

type WeekData<T> = T[][];
export type FixturesWeekData = WeekData<ExtendedFixtureDTO>;
export type StandingsWeekData = WeekData<StandingsDTO>;
