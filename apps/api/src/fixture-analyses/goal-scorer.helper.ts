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
  const REQUIRED_CONSECUTIVE_FIXTURES = 3;
  let consecutiveFixturesScored = 0;

  for (const game of games.slice(0, LAST_FIXTURES_AMOUNT)) {
    const playerScored = game.some((scorer) =>
      isSameGoalScorer(scorer, player)
    );

    consecutiveFixturesScored = playerScored
      ? consecutiveFixturesScored + 1
      : 0;

    if (consecutiveFixturesScored >= REQUIRED_CONSECUTIVE_FIXTURES) {
      return player;
    }
  }

  return null;
}
