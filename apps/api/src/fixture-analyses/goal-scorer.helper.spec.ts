import {
  getGoalScorerGoalsByMatch,
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

  it('keeps a streak in the three latest games when older games have no goals', () => {
    const scorer = { id: 192032, name: 'Iván Romero' };
    const abbreviatedScorer = { id: 192032, name: 'I. Romero' };

    expect(
      getPlayerWithGoalStreak(
        [[scorer], [scorer], [abbreviatedScorer], [], []],
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

describe('goal counts by match', () => {
  it('groups name variants by player ID and returns oldest-to-newest counts', () => {
    expect(
      getGoalScorerGoalsByMatch([
        [
          { id: 42, name: 'I. Romero' },
          { id: 42, name: 'I. Romero' },
          { id: 84, name: 'Ivan Romera' },
        ],
        [],
        [{ id: 42, name: 'Ivan Romero' }],
      ])
    ).toEqual([
      { name: 'I. Romero', goalsByMatch: [1, 0, 2] },
      { name: 'Ivan Romera', goalsByMatch: [0, 0, 1] },
    ]);
  });

  it('keeps similar names separate and uses exact names when IDs are missing', () => {
    expect(
      getGoalScorerGoalsByMatch([
        [
          { id: 42, name: 'Ivan Romero' },
          { id: 84, name: 'I. Romero' },
          { name: 'Paco Cortes' },
        ],
        [{ name: 'Paco Cortes' }],
      ])
    ).toEqual([
      { name: 'Ivan Romero', goalsByMatch: [0, 1] },
      { name: 'I. Romero', goalsByMatch: [0, 1] },
      { name: 'Paco Cortes', goalsByMatch: [1, 1] },
    ]);
  });

  it('uses a unique stable ID for exact-name events where the ID is missing', () => {
    expect(
      getGoalScorerGoalsByMatch([
        [{ id: 42, name: 'Ivan Romero' }],
        [{ name: 'Ivan Romero' }],
        [{ id: 42, name: 'Ivan Romero' }],
      ])
    ).toEqual([{ name: 'Ivan Romero', goalsByMatch: [1, 1, 1] }]);
  });
});
