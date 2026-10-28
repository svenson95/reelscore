import { createMatchEvent } from '@testing/client';

import {
  buildEventTimeline,
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
    const goalBeforeFallbackWindow = createMatchEvent({
      time: { elapsed: 34, extra: null },
      result: { home: 1, away: 0 },
    });
    const goalInsideFallbackWindow = createMatchEvent({
      time: { elapsed: 40, extra: null },
      result: { home: 1, away: 0 },
    });

    expect(
      isSecondHalfEvent(
        goalBeforeFallbackWindow,
        { home: 0, away: 0 },
        undefined
      )
    ).toBe(false);
    expect(
      isSecondHalfEvent(
        goalInsideFallbackWindow,
        { home: 0, away: 0 },
        undefined
      )
    ).toBe(true);
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

  it('recognizes elapsed minutes after regulation as extra time', () => {
    const extraTimeGoal = createMatchEvent({
      time: { elapsed: 105, extra: 2 },
    });

    expect(isExtraTimeEvent(extraTimeGoal, undefined)).toBe(true);
    expect(
      isExtraTimeEvent(
        createMatchEvent({ time: { elapsed: 90, extra: 4 } }),
        undefined
      )
    ).toBe(false);
    expect(
      isExtraTimeEvent(
        createMatchEvent({ time: { elapsed: 91, extra: null } }),
        undefined
      )
    ).toBe(true);
    expect(
      isExtraTimeEvent(
        createMatchEvent({ time: { elapsed: 91, extra: null } }),
        { home: 4, away: 3 }
      )
    ).toBe(true);
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

  it('uses the same phase boundaries in chronological and report order', () => {
    const scores = {
      halftime: { home: 1, away: 0 },
      penalty: { home: 4, away: 3 },
    };
    const events = [
      createMatchEvent({
        detail: 'Penalty',
        time: { elapsed: 120, extra: 1 },
      }),
      createMatchEvent({ time: { elapsed: 106, extra: null } }),
      createMatchEvent({ time: { elapsed: 90, extra: 6 } }),
      createMatchEvent({ time: { elapsed: 65, extra: null } }),
      createMatchEvent({ time: { elapsed: 6, extra: null } }),
    ];

    const descendingTimeline = buildEventTimeline(events, scores, 'descending');
    const ascendingTimeline = buildEventTimeline(events, scores, 'ascending');

    expect(
      descendingTimeline
        .filter((entry) => entry.type === 'spacer')
        .map((entry) => entry.boundary)
    ).toEqual(['penalty-shootout', 'extra-time', 'halftime']);
    expect(
      ascendingTimeline
        .filter((entry) => entry.type === 'spacer')
        .map((entry) => entry.boundary)
    ).toEqual(['halftime', 'extra-time', 'penalty-shootout']);
  });

  it('reverses source order for events in the same minute in report order', () => {
    const firstPenalty = createMatchEvent({
      time: { elapsed: 124, extra: null },
      player: { id: 1, name: 'A. Hakimi' },
    });
    const secondPenalty = createMatchEvent({
      time: { elapsed: 124, extra: null },
      player: { id: 2, name: 'G. Martinelli' },
    });
    const events = [firstPenalty, secondPenalty];
    const scores = { halftime: undefined, penalty: { home: 4, away: 3 } };

    const ascendingEvents = buildEventTimeline(events, scores, 'ascending')
      .filter((entry) => entry.type === 'event')
      .map((entry) => entry.event);
    const descendingEvents = buildEventTimeline(events, scores, 'descending')
      .filter((entry) => entry.type === 'event')
      .map((entry) => entry.event);

    expect(ascendingEvents).toEqual([firstPenalty, secondPenalty]);
    expect(descendingEvents).toEqual([secondPenalty, firstPenalty]);
  });
});
