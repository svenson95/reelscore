import { FixturesState } from './fixtures/fixtures.reducer';
import { StandingsState } from './standings/standings.reducer';

export interface AppState {
  standings: StandingsState;
  fixtures: FixturesState;
}
