import type {
  GoalScorerGoalsByMatch,
  PlayerId,
  PlayerName,
} from '@reelscore-sdk/models';

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

export function getGoalScorerGoalsByMatch(
  games: GoalScorer[][],
  scorerKeys?: Set<string>
): GoalScorerGoalsByMatch[] {
  const playerIdsByName = new Map<PlayerName, Set<PlayerId>>();

  for (const scorer of games.flat()) {
    if (!hasPlayerId(scorer)) continue;

    const playerIds = playerIdsByName.get(scorer.name) ?? new Set<PlayerId>();
    playerIds.add(scorer.id);
    playerIdsByName.set(scorer.name, playerIds);
  }

  const goalsByScorer = new Map<
    string,
    { name: PlayerName; goalsByMatch: number[] }
  >();

  games.forEach((game, gameIndex) => {
    for (const scorer of game) {
      const key = getGoalScorerKeyWithKnownIds(scorer, playerIdsByName);
      let scorerGoals = goalsByScorer.get(key);

      if (!scorerGoals) {
        scorerGoals = {
          name: scorer.name,
          goalsByMatch: Array.from({ length: games.length }, () => 0),
        };
        goalsByScorer.set(key, scorerGoals);
      }

      const oldestToNewestIndex = games.length - gameIndex - 1;
      scorerGoals.goalsByMatch[oldestToNewestIndex] += 1;
    }
  });

  return [...goalsByScorer.entries()]
    .filter(([key]) => !scorerKeys || scorerKeys.has(key))
    .map(([, { name, goalsByMatch }]) => ({
      name,
      goalsByMatch,
    }));
}

function getGoalScorerKeyWithKnownIds(
  scorer: GoalScorer,
  playerIdsByName: Map<PlayerName, Set<PlayerId>>
): string {
  if (hasPlayerId(scorer)) return getGoalScorerKey(scorer);

  const playerIds = playerIdsByName.get(scorer.name);
  if (playerIds?.size === 1) {
    return `id:${[...playerIds][0]}`;
  }

  return getGoalScorerKey(scorer);
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
