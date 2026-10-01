import type { EventDTO } from '@reelscore-sdk/models';

import type { RapidEventsDTO } from '@lib/models';

import {
  FixtureEventsController,
  type FixtureEventsReader,
} from './fixture-events.controller';

const eventAt = (elapsed: number, extra: number | null = null): EventDTO => ({
  time: { elapsed, extra },
  team: { id: 1, name: 'Home', logo: '', goals: 0 },
  player: { id: 1, name: 'Player' },
  assist: { id: null, name: null },
  type: 'Goal',
  detail: 'Normal Goal',
  comments: '',
});

const responseWith = (response: EventDTO[]): RapidEventsDTO => ({
  parameters: { fixture: 42 },
  errors: [],
  paging: { current: 1, total: 1 },
  response,
});

describe(FixtureEventsController.name, () => {
  it('returns events from latest to earliest without modifying the service result', async () => {
    const events = [eventAt(12), eventAt(45), eventAt(45, 3)];
    const serviceResult = responseWith(events);
    const eventsReader: FixtureEventsReader = {
      findById: jest.fn().mockResolvedValue(serviceResult),
    };
    const controller = new FixtureEventsController(eventsReader);

    const result = await controller.getById('42');

    expect(eventsReader.findById).toHaveBeenCalledWith('42');
    expect(result?.response).toEqual([events[2], events[1], events[0]]);
    expect(serviceResult.response).toEqual(events);
  });

  it('returns null when no fixture events exist', async () => {
    const eventsReader: FixtureEventsReader = {
      findById: jest.fn().mockResolvedValue(null),
    };
    const controller = new FixtureEventsController(eventsReader);

    await expect(controller.getById('missing')).resolves.toBeNull();
  });
});
