import { createMatchEvent } from '@testing/client';

import {
  hasFirstHalfEvents,
  isExtraTimeEvent,
  isPenaltyShootoutEvent,
  isSecondHalfEvent,
} from './event-timeline.helper';

describe('event timeline helpers', () => {
  it('identifies shootout penalties only when the fixture has a penalty score', () => {
    const penalty = createMatchEvent({
      detail: 'Penalty',
      time: { elapsed: 120, extra: null },
    });

    expect(isPenaltyShootoutEvent(penalty, { home: 4, away: 3 })).toBe(true);
    expect(isPenaltyShootoutEvent(penalty, { home: null, away: null })).toBe(
      false
    );
    expect(isPenaltyShootoutEvent(penalty, undefined)).toBe(false);
  });

  it('distinguishes first and second half events around stoppage time', () => {
    const firstHalfGoal = createMatchEvent({
      time: { elapsed: 45, extra: 4 },
      result: { home: 1, away: 0 },
    });
    const secondHalfBoundaryGoal = createMatchEvent({
      time: { elapsed: 45, extra: 2 },
      result: { home: 2, away: 0 },
    });

    expect(hasFirstHalfEvents([firstHalfGoal], undefined)).toBe(true);
    expect(
      isSecondHalfEvent(firstHalfGoal, { home: 1, away: 0 }, undefined)
    ).toBe(false);
    expect(
      isSecondHalfEvent(secondHalfBoundaryGoal, { home: 1, away: 0 }, undefined)
    ).toBe(true);
    expect(
      isSecondHalfEvent(
        createMatchEvent({ time: { elapsed: 46, extra: null } }),
        null,
        undefined
      )
    ).toBe(true);
    expect(
      isSecondHalfEvent(
        createMatchEvent({ time: { elapsed: 30, extra: null } }),
        { home: 0, away: 0 },
        undefined
      )
    ).toBe(false);
    expect(
      isSecondHalfEvent(
        createMatchEvent({ type: 'Card', detail: 'Yellow Card' }),
        { home: 0, away: 0 },
        undefined
      )
    ).toBe(false);
    expect(
      isSecondHalfEvent(
        createMatchEvent({
          time: { elapsed: 40, extra: null },
          result: { home: 1, away: 0 },
        }),
        null,
        undefined
      )
    ).toBe(false);
  });

  it('reports whether the timeline contains any first-half events', () => {
    expect(
      hasFirstHalfEvents(
        [createMatchEvent({ time: { elapsed: 12, extra: null } })],
        undefined
      )
    ).toBe(true);
    expect(
      hasFirstHalfEvents(
        [createMatchEvent({ time: { elapsed: 60, extra: null } })],
        undefined
      )
    ).toBe(false);
  });

  it('recognizes extra-time events separately from regulation and shootouts', () => {
    const extraTimeGoal = createMatchEvent({
      time: { elapsed: 105, extra: 2 },
    });

    expect(
      isExtraTimeEvent(extraTimeGoal, { home: 2, away: 2 }, undefined)
    ).toBe(true);
    expect(
      isExtraTimeEvent(extraTimeGoal, { home: null, away: null }, undefined)
    ).toBe(false);
    expect(
      isExtraTimeEvent(
        createMatchEvent({ time: { elapsed: 90, extra: 4 } }),
        { home: 2, away: 2 },
        undefined
      )
    ).toBe(false);
  });

  it('does not classify a shootout event as a second-half event', () => {
    const penalty = createMatchEvent({
      detail: 'Penalty',
      time: { elapsed: 120, extra: null },
    });

    expect(
      isSecondHalfEvent(penalty, { home: 1, away: 1 }, { home: 4, away: 3 })
    ).toBe(false);
  });
});
