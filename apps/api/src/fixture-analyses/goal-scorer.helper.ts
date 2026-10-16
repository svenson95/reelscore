import type { PlayerId, PlayerName } from '@reelscore-sdk/models';

export interface GoalScorer {
  id?: PlayerId;
  name: PlayerName;
}

function hasPlayerId(
  scorer: GoalScorer
): scorer is GoalScorer & { id: PlayerId } {
  return typeof scorer.id === 'number' && Number.isFinite(scorer.id);
}

export function getGoalScorerKey(scorer: GoalScorer): string {
  return hasPlayerId(scorer) ? `id:${scorer.id}` : `name:${scorer.name}`;
}

export function isSameGoalScorer(
  first: GoalScorer,
  second: GoalScorer
): boolean {
  if (hasPlayerId(first) && hasPlayerId(second)) {
    return first.id === second.id;
  }

  return first.name === second.name;
}

export function getPlayerWithGoalStreak(
  games: GoalScorer[][],
  player: GoalScorer
): GoalScorer | null {
  const LAST_FIXTURES_AMOUNT = 5;
  const STREAK_FAIL_AT_AMOUNT = 2;
  let streakFail = 0;
  const score = games.slice(0, LAST_FIXTURES_AMOUNT).reduce((acc, game) => {
    const playerScored = game.some((scorer) =>
      isSameGoalScorer(scorer, player)
    );
    if (!playerScored) streakFail++;
    if (streakFail === STREAK_FAIL_AT_AMOUNT) return 0;
    return acc + (playerScored ? 1 : 0);
  }, 0);

  return score >= 3 ? player : null;
}
