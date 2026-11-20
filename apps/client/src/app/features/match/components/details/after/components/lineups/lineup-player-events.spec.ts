import type { EventWithResult } from '@reelscore-sdk/models';

import { getLineupPlayerEvents, ratingCategory } from './lineup-player-events';

const substitution: EventWithResult = {
  time: { elapsed: 90, extra: 3 },
  team: { id: 1, name: 'Home', logo: '', goals: 0 },
  player: { id: 10, name: 'Outgoing' },
  assist: { id: 11, name: 'Incoming' },
  type: 'subst',
  detail: 'Substitution',
  comments: '',
  result: { home: 0, away: 0 },
};

describe('lineup player events', () => {
  it('combines goals, preserves their minutes and handles own goals', () => {
    const goal: EventWithResult = {
      ...substitution,
      time: { elapsed: 12, extra: null },
      type: 'Goal',
      detail: 'Normal Goal',
    };
    const penalty: EventWithResult = {
      ...goal,
      time: { elapsed: 65, extra: null },
      detail: 'Penalty',
    };
    const ownGoal: EventWithResult = { ...goal, detail: 'Own Goal' };

    expect(getLineupPlayerEvents([goal, penalty, ownGoal], 1, 10)).toEqual([
      { type: 'goal', minute: "12', 65'", label: "2 Tore: 12', 65'", count: 2 },
      { type: 'own-goal', minute: "12'", label: "Eigentor 12'" },
    ]);
    expect(getLineupPlayerEvents([goal], null, 10)).toEqual([]);
    expect(getLineupPlayerEvents([goal], 1, 0)).toEqual([]);
  });
  it('assigns each side of a substitution and preserves stoppage time', () => {
    expect(getLineupPlayerEvents([substitution], 1, 10)).toEqual([
      {
        type: 'substitution-out',
        minute: "90+3'",
        label: "Ausgewechselt 90+3'",
      },
    ]);
    expect(getLineupPlayerEvents([substitution], 1, 11)).toEqual([
      {
        type: 'substitution-in',
        minute: "90+3'",
        label: "Eingewechselt 90+3'",
      },
    ]);
    expect(getLineupPlayerEvents([substitution], 2, 10)).toEqual([]);
  });

  it('shows goals and cards for their player, but not missed penalties', () => {
    const goal: EventWithResult = {
      ...substitution,
      type: 'Goal',
      detail: 'Normal Goal',
    };
    const missedPenalty: EventWithResult = {
      ...goal,
      detail: 'Missed Penalty',
    };
    const yellowCard: EventWithResult = {
      ...substitution,
      type: 'Card',
      detail: 'Yellow Card',
    };
    const redCard: EventWithResult = {
      ...substitution,
      type: 'Card',
      detail: 'Red Card',
    };

    expect(
      getLineupPlayerEvents(
        [goal, missedPenalty, yellowCard, redCard],
        1,
        10
      ).map((event) => event.type)
    ).toEqual(['goal', 'yellow-card', 'red-card']);
    expect(getLineupPlayerEvents([goal], 1, 11)).toEqual([]);
  });

  it('places substitutions after goals and cards regardless of event order', () => {
    const goal: EventWithResult = {
      ...substitution,
      type: 'Goal',
      detail: 'Normal Goal',
    };
    const yellowCard: EventWithResult = {
      ...substitution,
      type: 'Card',
      detail: 'Yellow Card',
    };

    expect(
      getLineupPlayerEvents([substitution, goal, yellowCard], 1, 10).map(
        (event) => event.type
      )
    ).toEqual(['goal', 'yellow-card', 'substitution-out']);
  });
});

describe('ratingCategory', () => {
  it.each([
    ['5.0', 'rating-red'],
    ['5.1', 'rating-orange'],
    ['6.0', 'rating-orange'],
    ['7.9', 'rating-yellow'],
    ['8.0', 'rating-green'],
    ['9.0', 'rating-bright-green'],
    ['0', null],
    ['', null],
    ['invalid', null],
  ])('maps %s to %s', (rating, expected) => {
    expect(ratingCategory(rating)).toBe(expected);
  });
});
