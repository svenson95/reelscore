import { createMatchEvent } from '@testing/client';

import {
  mergeSecondYellowCardEvents,
  SECOND_YELLOW_CARD_COMMENT,
} from './second-yellow-card.helper';

describe('mergeSecondYellowCardEvents', () => {
  it.each([
    ['Yellow Card', 'Red Card'],
    ['Red Card', 'Yellow Card'],
  ] as const)(
    'merges a %s and %s for the same player in the same minute',
    (firstDetail, secondDetail) => {
      const firstCard = createMatchEvent({
        type: 'Card',
        detail: firstDetail,
        comments: 'First card comment',
      });
      const secondCard = createMatchEvent({
        type: 'Card',
        detail: secondDetail,
        comments: 'Second card comment',
      });

      expect(mergeSecondYellowCardEvents([firstCard, secondCard])).toEqual([
        {
          ...firstCard,
          detail: 'Red Card',
          comments: 'First card comment',
          isSecondYellowCard: true,
        },
      ]);
    }
  );

  it('uses the second event comment when the first event has none', () => {
    const yellowCard = createMatchEvent({
      type: 'Card',
      detail: 'Yellow Card',
      comments: null,
    });
    const redCard = createMatchEvent({
      type: 'Card',
      detail: 'Red Card',
      comments: 'Second card comment',
    });

    expect(mergeSecondYellowCardEvents([yellowCard, redCard])).toEqual([
      {
        ...yellowCard,
        detail: 'Red Card',
        comments: 'Second card comment',
        isSecondYellowCard: true,
      },
    ]);
  });

  it('marks a later dismissal for the previously cautioned player only', () => {
    const yellowCard = createMatchEvent({
      type: 'Card',
      detail: 'Yellow Card',
    });
    const differentPlayerRedCard = createMatchEvent({
      type: 'Card',
      detail: 'Red Card',
      player: { id: 11, name: 'Other player' },
    });
    const laterRedCard = createMatchEvent({
      type: 'Card',
      detail: 'Red Card',
      time: { elapsed: 21, extra: null },
    });

    expect(
      mergeSecondYellowCardEvents([
        yellowCard,
        differentPlayerRedCard,
        laterRedCard,
      ])
    ).toEqual([
      yellowCard,
      differentPlayerRedCard,
      {
        ...laterRedCard,
        comments: SECOND_YELLOW_CARD_COMMENT,
        isSecondYellowCard: true,
      },
    ]);
  });

  it('does not merge different teams, non-card events, or unidentified players', () => {
    const yellowCard = createMatchEvent({
      type: 'Card',
      detail: 'Yellow Card',
      player: { id: 0, name: '' },
    });
    const otherTeamRedCard = createMatchEvent({
      type: 'Card',
      detail: 'Red Card',
      team: { id: 20, name: 'Other team', logo: '', goals: 0 },
      player: { id: 0, name: '' },
    });
    const unidentifiedRedCard = createMatchEvent({
      type: 'Card',
      detail: 'Red Card',
      player: { id: 0, name: '' },
    });
    const goal = createMatchEvent({ type: 'Goal', detail: 'Normal Goal' });

    expect(mergeSecondYellowCardEvents([yellowCard, otherTeamRedCard])).toEqual(
      [yellowCard, otherTeamRedCard]
    );
    expect(mergeSecondYellowCardEvents([goal, otherTeamRedCard])).toEqual([
      goal,
      otherTeamRedCard,
    ]);
    expect(
      mergeSecondYellowCardEvents([yellowCard, unidentifiedRedCard])
    ).toEqual([yellowCard, unidentifiedRedCard]);
  });

  it('merges when player names match and elapsed plus extra time matches', () => {
    const yellowCard = createMatchEvent({
      type: 'Card',
      detail: 'Yellow Card',
      player: { id: 0, name: 'Same player' },
      time: { elapsed: 20, extra: 1 },
    });
    const redCard = createMatchEvent({
      type: 'Card',
      detail: 'Red Card',
      player: { id: 0, name: 'Same player' },
      time: { elapsed: 21, extra: null },
    });

    expect(mergeSecondYellowCardEvents([yellowCard, redCard])).toEqual([
      {
        ...yellowCard,
        detail: 'Red Card',
        comments: SECOND_YELLOW_CARD_COMMENT,
        isSecondYellowCard: true,
      },
    ]);
  });

  it('marks a later red card as second yellow when the same player was cautioned earlier', () => {
    const yellowCard = createMatchEvent({
      type: 'Card',
      detail: 'Yellow Card',
      time: { elapsed: 45, extra: null },
    });
    const redCard = createMatchEvent({
      type: 'Card',
      detail: 'Red Card',
      time: { elapsed: 91, extra: null },
    });

    expect(mergeSecondYellowCardEvents([yellowCard, redCard])).toEqual([
      yellowCard,
      {
        ...redCard,
        comments: SECOND_YELLOW_CARD_COMMENT,
        isSecondYellowCard: true,
      },
    ]);
  });

  it('preserves a reason comment on a later red card', () => {
    const yellowCard = createMatchEvent({
      type: 'Card',
      detail: 'Yellow Card',
      time: { elapsed: 45, extra: null },
    });
    const redCard = createMatchEvent({
      type: 'Card',
      detail: 'Red Card',
      comments: 'Professional foul',
      time: { elapsed: 91, extra: null },
    });

    expect(mergeSecondYellowCardEvents([yellowCard, redCard])).toEqual([
      yellowCard,
      {
        ...redCard,
        comments: 'Professional foul',
        isSecondYellowCard: true,
      },
    ]);
  });

  it('does not merge a yellow card with a goal event', () => {
    const yellowCard = createMatchEvent({
      type: 'Card',
      detail: 'Yellow Card',
    });
    const goal = createMatchEvent({
      type: 'Goal',
      detail: 'Normal Goal',
      time: { elapsed: 20, extra: null },
    });

    expect(mergeSecondYellowCardEvents([yellowCard, goal])).toEqual([
      yellowCard,
      goal,
    ]);
  });

  it('does not mutate the input events', () => {
    const yellowCard = createMatchEvent({
      type: 'Card',
      detail: 'Yellow Card',
    });
    const redCard = createMatchEvent({ type: 'Card', detail: 'Red Card' });

    mergeSecondYellowCardEvents([yellowCard, redCard]);

    expect(yellowCard.detail).toBe('Yellow Card');
    expect(redCard.detail).toBe('Red Card');
  });
});
