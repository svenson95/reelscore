import type { EventWithResult, Goals } from '@reelscore-sdk/models';

import { getEventTimelineMinute } from '@lib/shared';

const EXTRA_TIME_START_ELAPSED_MINUTE = 90;
const REGULATION_HALF_END_MINUTE = 45;
const HALFTIME_SCORE_FALLBACK_WINDOW_MINUTES = 10;
const EARLIEST_MINUTE_FOR_SCORE_BASED_HALF_INFERENCE =
  REGULATION_HALF_END_MINUTE - HALFTIME_SCORE_FALLBACK_WINDOW_MINUTES;

export type EventTimelineBoundary =
  | 'halftime'
  | 'extra-time'
  | 'penalty-shootout';

export type EventTimelineEntry<TEvent extends EventWithResult> =
  | { type: 'event'; event: TEvent }
  | { type: 'spacer'; boundary: EventTimelineBoundary };

export type EventTimelineOrder = 'ascending' | 'descending';

export interface EventTimelineScores {
  halftime: Goals | null | undefined;
  penalty: Goals | null | undefined;
}

export function isPenaltyShootoutEvent(
  event: Pick<EventWithResult, 'time' | 'type' | 'detail'>,
  penaltyScore: Goals | null | undefined
): boolean {
  const hasPenaltyScore =
    penaltyScore?.home != null || penaltyScore?.away != null;

  return (
    hasPenaltyScore &&
    event.time.elapsed + (event.time.extra ?? 0) >= 120 &&
    event.type === 'Goal' &&
    ['Penalty', 'Missed Penalty'].includes(event.detail)
  );
}

export function hasFirstHalfEvents(
  events: EventWithResult[],
  penaltyScore: Goals | null | undefined
): boolean {
  return events.some(
    (event) =>
      event.time.elapsed <= 45 && !isPenaltyShootoutEvent(event, penaltyScore)
  );
}

export function isExtraTimeEvent(
  event: Pick<EventWithResult, 'time' | 'type' | 'detail'>,
  penaltyScore: Goals | null | undefined
): boolean {
  return (
    !isPenaltyShootoutEvent(event, penaltyScore) &&
    event.time.elapsed > EXTRA_TIME_START_ELAPSED_MINUTE
  );
}

export function isSecondHalfEvent(
  event: EventWithResult,
  halftimeScore: Goals | null | undefined,
  penaltyScore: Goals | null | undefined
): boolean {
  if (isPenaltyShootoutEvent(event, penaltyScore)) {
    return false;
  }

  if (event.time.elapsed > 45) {
    return true;
  }

  if (
    event.type !== 'Goal' ||
    event.time.elapsed < EARLIEST_MINUTE_FOR_SCORE_BASED_HALF_INFERENCE ||
    halftimeScore?.home == null ||
    halftimeScore.away == null
  ) {
    return false;
  }

  // The score fallback resolves ambiguous goals in the final 10 minutes of a half.
  return (
    event.result.home > halftimeScore.home ||
    event.result.away > halftimeScore.away
  );
}

export function buildEventTimeline<TEvent extends EventWithResult>(
  events: TEvent[],
  scores: EventTimelineScores,
  order: EventTimelineOrder
): EventTimelineEntry<TEvent>[] {
  const orderedEvents = events
    .map((event, index) => ({ event, index }))
    .sort((first, second) => {
      const minuteDifference =
        getEventTimelineMinute(first.event) -
        getEventTimelineMinute(second.event);
      const sourceOrderDifference = first.index - second.index;

      return order === 'ascending'
        ? minuteDifference || sourceOrderDifference
        : -minuteDifference || sourceOrderDifference;
    })
    .map(({ event }) => event);

  const hasFirstHalf = hasFirstHalfEvents(orderedEvents, scores.penalty);
  const entries: EventTimelineEntry<TEvent>[] = [];
  let hasHalftimeBoundary = false;
  let hasExtraTimeBoundary = false;
  let hasPenaltyShootoutBoundary = false;

  for (let index = 0; index < orderedEvents.length; index++) {
    const event = orderedEvents[index];
    const previousEvent = orderedEvents[index - 1];

    const beginsSecondHalf =
      isSecondHalfEvent(event, scores.halftime, scores.penalty) &&
      !hasHalftimeBoundary;
    const beginsExtraTime =
      isExtraTimeEvent(event, scores.penalty) && !hasExtraTimeBoundary;
    const beginsPenaltyShootout =
      isPenaltyShootoutEvent(event, scores.penalty) &&
      !hasPenaltyShootoutBoundary;

    if (order === 'ascending') {
      if (hasFirstHalf && beginsSecondHalf) {
        entries.push({ type: 'spacer', boundary: 'halftime' });
        hasHalftimeBoundary = true;
      }

      if (beginsExtraTime) {
        entries.push({ type: 'spacer', boundary: 'extra-time' });
        hasExtraTimeBoundary = true;
      }

      if (beginsPenaltyShootout) {
        entries.push({ type: 'spacer', boundary: 'penalty-shootout' });
        hasPenaltyShootoutBoundary = true;
      }
    } else if (previousEvent) {
      if (
        isPenaltyShootoutEvent(previousEvent, scores.penalty) &&
        !isPenaltyShootoutEvent(event, scores.penalty) &&
        !hasPenaltyShootoutBoundary
      ) {
        entries.push({ type: 'spacer', boundary: 'penalty-shootout' });
        hasPenaltyShootoutBoundary = true;
      }

      if (
        isExtraTimeEvent(previousEvent, scores.penalty) &&
        !isExtraTimeEvent(event, scores.penalty) &&
        !hasExtraTimeBoundary
      ) {
        entries.push({ type: 'spacer', boundary: 'extra-time' });
        hasExtraTimeBoundary = true;
      }

      if (
        hasFirstHalf &&
        isSecondHalfEvent(previousEvent, scores.halftime, scores.penalty) &&
        !isSecondHalfEvent(event, scores.halftime, scores.penalty) &&
        !hasHalftimeBoundary
      ) {
        entries.push({ type: 'spacer', boundary: 'halftime' });
        hasHalftimeBoundary = true;
      }
    }

    entries.push({ type: 'event', event });
  }

  return entries;
}
