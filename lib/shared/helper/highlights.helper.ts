import { type EventDTO, type FixtureHighlights, timeTotal } from '../../models';

export const isHighlightGoal = (
  event: Pick<EventDTO, 'type' | 'detail'>,
  includeMissedPenalty: boolean = false
): boolean =>
  event.type === 'Goal' &&
  (['Normal Goal', 'Own Goal', 'Penalty'].includes(event.detail) ||
    (includeMissedPenalty && event.detail === 'Missed Penalty'));

export const filterFixtureHighlights = (
  events: EventDTO[] = []
): FixtureHighlights => {
  const goals = events.filter((event) => isHighlightGoal(event, true));
  const redCards = events.filter(
    ({ type, detail }) => type === 'Card' && detail === 'Red Card'
  );

  return [...goals, ...redCards].sort((a, b) => timeTotal(a) - timeTotal(b));
};
