import { GoalScorers } from '../player.model';

export type FixturePlayersWithStreak = {
  home: GoalScorers;
  away: GoalScorers;
};
export interface MetricsDTO {
  playersWithStreak: FixturePlayersWithStreak;
}
