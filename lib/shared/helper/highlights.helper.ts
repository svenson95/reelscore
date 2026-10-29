import type { EventDTO, FixtureHighlights } from '@reelscore-sdk/models';

const REGULATION_TIME_END_MINUTE = 90;
const EXTRA_TIME_OFFSET = 15;
const PENALTY_SHOOTOUT_OFFSET = 30;

export const getEventTimelineMinute = (
  event: Pick<EventDTO, 'time' | 'comments'>
): number => {
  const totalMinute = event.time.elapsed + (event.time.extra ?? 0);
  const isPenaltyShootoutEvent = event.comments === 'Penalty Shootout';
  const isExtraTimeEvent = event.time.elapsed > REGULATION_TIME_END_MINUTE;

  if (isPenaltyShootoutEvent) return totalMinute + PENALTY_SHOOTOUT_OFFSET;

  return isExtraTimeEvent ? totalMinute + EXTRA_TIME_OFFSET : totalMinute;
};

export const isHighlightGoal = (
  event: Pick<EventDTO, 'type' | 'detail'>,
  includeMissedPenalty = false
): boolean =>
  event.type === 'Goal' &&
  (['Normal Goal', 'Own Goal', 'Penalty'].includes(event.detail) ||
    (includeMissedPenalty && event.detail === 'Missed Penalty'));

export const filterFixtureHighlights = (
  events: EventDTO[] = []
): FixtureHighlights => {
  return events
    .filter(
      (event) =>
        isHighlightGoal(event, true) ||
        (event.type === 'Card' && event.detail === 'Red Card')
    )
    .map((event, index) => ({ event, index }))
    .sort(
      (first, second) =>
        getEventTimelineMinute(first.event) -
          getEventTimelineMinute(second.event) || first.index - second.index
    )
    .map(({ event }) => event);
};
