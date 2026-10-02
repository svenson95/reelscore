import type { TopScorer } from '@reelscore-sdk/models';

type PlayerStatistics = {
  goals: number;
  penaltyGoals: number;
  assists: number;
  minutes: number;
};

export function getPlayerStatistics(stat: TopScorer): PlayerStatistics {
  const statistics = stat.statistics[0];

  return {
    goals: statistics.goals.total ?? 0,
    penaltyGoals: statistics.penalty.scored ?? 0,
    assists: statistics.goals.assists ?? 0,
    minutes: statistics.games.minutes ?? 0,
  };
}

export function sortTopScorers(first: TopScorer, second: TopScorer): number {
  const firstStatistics = getPlayerStatistics(first);
  const secondStatistics = getPlayerStatistics(second);

  return (
    secondStatistics.goals - firstStatistics.goals ||
    firstStatistics.penaltyGoals - secondStatistics.penaltyGoals ||
    secondStatistics.assists - firstStatistics.assists ||
    firstStatistics.minutes - secondStatistics.minutes
  );
}

export function sortAssistProviders(
  first: TopScorer,
  second: TopScorer
): number {
  const firstStatistics = getPlayerStatistics(first);
  const secondStatistics = getPlayerStatistics(second);

  return (
    secondStatistics.assists - firstStatistics.assists ||
    secondStatistics.goals - firstStatistics.goals ||
    firstStatistics.minutes - secondStatistics.minutes
  );
}

export function getGoalScorers(players: TopScorer[]): TopScorer[] {
  return [...players]
    .sort(sortTopScorers)
    .filter((player) => getPlayerStatistics(player).goals > 0);
}

export function getAssistProviders(players: TopScorer[]): TopScorer[] {
  return [...players]
    .sort(sortAssistProviders)
    .filter((player) => getPlayerStatistics(player).assists > 0);
}
