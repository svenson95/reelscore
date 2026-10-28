import type { EventWithResult, Goals } from '@reelscore-sdk/models';

const POSSIBLE_SECOND_HALF_BOUNDARY_MINUTE = 35;

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
  extraTimeScore: Goals | null | undefined,
  penaltyScore: Goals | null | undefined
): boolean {
  const hasExtraTimeScore =
    extraTimeScore?.home != null || extraTimeScore?.away != null;

  return (
    hasExtraTimeScore &&
    !isPenaltyShootoutEvent(event, penaltyScore) &&
    event.time.elapsed + (event.time.extra ?? 0) >= 105
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
    event.time.elapsed < POSSIBLE_SECOND_HALF_BOUNDARY_MINUTE ||
    halftimeScore?.home == null ||
    halftimeScore.away == null
  ) {
    return false;
  }

  return (
    event.result.home > halftimeScore.home ||
    event.result.away > halftimeScore.away
  );
}
