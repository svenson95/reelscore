import { GoalScorers } from '../player.model';

export type FixturePlayersWithStreak = {
  home: GoalScorers;
  away: GoalScorers;
};
export type FixtureHomeOrAwayStrong = {
  home: boolean;
  away: boolean;
};
export interface AnalysesDTO {
  playersWithStreak: FixturePlayersWithStreak;
  homeOrAwayStrong: FixtureHomeOrAwayStrong;
}
