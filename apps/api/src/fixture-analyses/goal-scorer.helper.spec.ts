import {
  getGoalScorerKey,
  getPlayerWithGoalStreak,
  isSameGoalScorer,
} from './goal-scorer.helper';

describe('goal scorer identity', () => {
  it('matches the same player by ID when event names use different formats', () => {
    const scorer = { id: 42, name: 'Ivan Romero' };
    const abbreviatedScorer = { id: 42, name: 'I. Romero' };

    expect(isSameGoalScorer(scorer, abbreviatedScorer)).toBe(true);
    expect(
      getPlayerWithGoalStreak(
        [[scorer], [abbreviatedScorer], [abbreviatedScorer]],
        scorer
      )
    ).toEqual(scorer);
  });

  it('does not merge different players with similar names when IDs exist', () => {
    const firstPlayer = { id: 42, name: 'Ivan Romero' };
    const secondPlayer = { id: 84, name: 'I. Romero' };

    expect(isSameGoalScorer(firstPlayer, secondPlayer)).toBe(false);
    expect(
      getPlayerWithGoalStreak(
        [[firstPlayer], [secondPlayer], [secondPlayer]],
        firstPlayer
      )
    ).toBeNull();
  });

  it('uses exact names as fallback when either event has no player ID', () => {
    expect(
      isSameGoalScorer({ name: 'Ivan Romero' }, { name: 'Ivan Romero' })
    ).toBe(true);
    expect(
      isSameGoalScorer({ name: 'Ivan Romero' }, { name: 'I. Romero' })
    ).toBe(false);
    expect(getGoalScorerKey({ name: 'Ivan Romero' })).toBe('name:Ivan Romero');
    expect(getGoalScorerKey({ id: Number.NaN, name: 'Ivan Romero' })).toBe(
      'name:Ivan Romero'
    );
  });
});
