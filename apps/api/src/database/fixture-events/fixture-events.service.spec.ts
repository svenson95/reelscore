import type { EventDTO } from '@reelscore-sdk/models';

import { isHighlightGoal } from '@lib/shared';

import { findDocument } from '../mongodb.helper';

import { FixtureEvents } from './fixture-events.model';
import { FixtureEventsService } from './fixture-events.service';

jest.mock('../mongodb.helper', () => ({
  ...jest.requireActual('../mongodb.helper'),
  findDocument: jest.fn(),
}));

describe('Fixture highlight filtering', () => {
  it.each<EventDTO['detail']>(['Normal Goal', 'Own Goal', 'Penalty'])(
    'recognizes %s for both highlights and scorer analyses',
    (detail) => {
      expect(isHighlightGoal({ type: 'Goal', detail })).toBe(true);
      expect(isHighlightGoal({ type: 'Goal', detail }, true)).toBe(true);
    }
  );

  it('includes missed penalties only when requested for highlights', () => {
    const event: Pick<EventDTO, 'type' | 'detail'> = {
      type: 'Goal',
      detail: 'Missed Penalty',
    };
    expect(isHighlightGoal(event)).toBe(false);
    expect(isHighlightGoal(event, true)).toBe(true);
    expect(isHighlightGoal({ type: 'Var', detail: 'Penalty' }, true)).toBe(
      false
    );
  });

  it('preserves highlight selection and ordering without modifying the input', () => {
    const event = (
      type: EventDTO['type'],
      detail: EventDTO['detail'],
      elapsed: number
    ): EventDTO => ({
      type,
      detail,
      time: { elapsed, extra: null },
      team: { id: 1, name: 'Home', logo: '', goals: 0 },
      player: { id: 1, name: 'Player' },
      assist: { id: 2, name: 'Assist' },
      comments: '',
    });
    const goal = event('Goal', 'Normal Goal', 30);
    const missedPenalty = event('Goal', 'Missed Penalty', 10);
    const redCard = event('Card', 'Red Card', 20);
    const yellowCard = event('Card', 'Yellow Card', 25);
    const events = [goal, redCard, yellowCard, missedPenalty];
    const service = new FixtureEventsService();

    expect(service.filterHighlights(events)).toEqual([
      missedPenalty,
      redCard,
      goal,
    ]);
    expect(events).toEqual([goal, redCard, yellowCard, missedPenalty]);
    expect(service.filterHighlights(undefined)).toEqual([]);
  });

  it('looks up event data by the fixture ID', async () => {
    const fixtureId = '42';
    const mockedFindDocument = jest.mocked(findDocument);
    mockedFindDocument.mockResolvedValue(null);

    await expect(new FixtureEventsService().findById(fixtureId)).resolves.toBe(
      null
    );

    expect(mockedFindDocument).toHaveBeenCalledWith(FixtureEvents, fixtureId);
  });
});
