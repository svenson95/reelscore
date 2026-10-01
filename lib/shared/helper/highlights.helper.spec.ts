import type { EventDTO } from '@reelscore-sdk/models';

import { filterFixtureHighlights, isHighlightGoal } from './highlights.helper';

function createEvent(
  type: EventDTO['type'],
  detail: EventDTO['detail'],
  elapsed: number,
  extra: number | null = null
): EventDTO {
  return {
    time: { elapsed, extra },
    team: { id: 1, name: 'Home', logo: '', goals: 0 },
    player: { id: 2, name: 'Player' },
    assist: { id: null, name: null },
    type,
    detail,
    comments: '',
  };
}

describe('fixture highlights', () => {
  it('includes missed penalties only when requested as goal highlights', () => {
    const missedPenalty = createEvent('Goal', 'Missed Penalty', 20);

    expect(isHighlightGoal(missedPenalty)).toBe(false);
    expect(isHighlightGoal(missedPenalty, true)).toBe(true);
  });

  it('selects and orders goals, missed penalties and red cards without mutating the events', () => {
    const lateGoal = createEvent('Goal', 'Normal Goal', 90, 4);
    const yellowCard = createEvent('Card', 'Yellow Card', 15);
    const redCard = createEvent('Card', 'Red Card', 90, 2);
    const missedPenalty = createEvent('Goal', 'Missed Penalty', 30);
    const events = [lateGoal, yellowCard, redCard, missedPenalty];

    const highlights = filterFixtureHighlights(events);

    expect(highlights).toEqual([missedPenalty, redCard, lateGoal]);
    expect(events).toEqual([lateGoal, yellowCard, redCard, missedPenalty]);
  });

  it('returns no highlights when no events are available', () => {
    expect(filterFixtureHighlights()).toEqual([]);
  });
});
