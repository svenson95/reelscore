import { FixtureDTO } from './fixtures/fixture.model';
import { StandingsDTO } from './standings/standings.model';

type WeekData<T> = T[][];
export type FixturesWeekData = WeekData<FixtureDTO>;
export type StandingsWeekData = WeekData<StandingsDTO>;
