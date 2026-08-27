import { TestBed } from '@angular/core/testing';

import type { FixtureDTO, RapidEventsDTO } from '@lib/models';
import {
  REALTIME_EVENT,
  type LiveFixtureEventsUpdateDTO,
  type LiveFixtureUpdateDTO,
} from '@lib/models';

import { environment } from '../../../environments/environment';
import {
  createOperationResponse,
  createRapidEvents,
} from '../../../testing/factories/realtime.factory';

import { LiveRefreshService } from './live-refresh.service';
import { RealtimeService } from './realtime.service';

describe('RealtimeService', () => {
  let service: RealtimeService;

  let originalEventSource: typeof EventSource;

  const liveRefreshServiceMock = {
    start: jest.fn(),
    stop: jest.fn(),
    refresh: jest.fn(),
  };

  beforeEach(() => {
    originalEventSource = globalThis.EventSource;

    MockEventSource.instances = [];

    Object.defineProperty(globalThis, 'EventSource', {
      configurable: true,
      writable: true,
      value: MockEventSource,
    });

    liveRefreshServiceMock.start.mockClear();
    liveRefreshServiceMock.stop.mockClear();
    liveRefreshServiceMock.refresh.mockReset();
    liveRefreshServiceMock.refresh.mockResolvedValue(true);

    TestBed.configureTestingModule({
      providers: [
        RealtimeService,
        {
          provide: LiveRefreshService,
          useValue: liveRefreshServiceMock,
        },
      ],
    });

    service = TestBed.inject(RealtimeService);
  });

  afterEach(() => {
    Object.defineProperty(globalThis, 'EventSource', {
      configurable: true,
      writable: true,
      value: originalEventSource,
    });
  });

  it('should initialize disconnected', () => {
    expect(service.status()).toBe('disconnected');
    expect(service.fixtureUpdate()).toBeNull();
    expect(service.fixtureEventsUpdate()).toBeNull();
  });

  it('should connect to the livestream endpoint', () => {
    service.connect();

    expect(service.status()).toBe('connecting');
    expect(MockEventSource.instances).toHaveLength(1);

    expect(MockEventSource.instances[0].url).toBe(
      `${environment.api}livestream`
    );
  });

  it('should not create multiple realtime connections', () => {
    service.connect();
    service.connect();

    expect(MockEventSource.instances).toHaveLength(1);
  });

  it('should disable polling fallback when realtime connects', () => {
    service.connect();

    const eventSource = getEventSource();

    eventSource.emitOpen();

    expect(service.status()).toBe('connected');
    expect(liveRefreshServiceMock.stop).toHaveBeenCalledTimes(1);
  });

  it('should enable polling fallback and refresh immediately on realtime error', () => {
    service.connect();

    const eventSource = getEventSource();

    eventSource.emitError();

    expect(service.status()).toBe('error');
    expect(liveRefreshServiceMock.start).toHaveBeenCalledTimes(1);

    expect(liveRefreshServiceMock.refresh).toHaveBeenCalledWith({
      force: true,
    });
  });

  it('should disable polling fallback again after reconnect', () => {
    service.connect();

    const eventSource = getEventSource();

    eventSource.emitError();
    eventSource.emitOpen();

    expect(service.status()).toBe('connected');
    expect(liveRefreshServiceMock.start).toHaveBeenCalledTimes(1);
    expect(liveRefreshServiceMock.stop).toHaveBeenCalledTimes(1);
  });

  it('should expose fixture updates', () => {
    const update = createFixtureUpdate(123);

    service.connect();

    getEventSource().emitMessage({
      id: '1',
      channel: 'default',
      event: REALTIME_EVENT.FIXTURE_UPDATED,
      data: update,
    });

    expect(service.fixtureUpdate()).toStrictEqual(update);
  });

  it('should expose fixture events updates', () => {
    const update = createFixtureEventsUpdate(123);

    service.connect();

    getEventSource().emitMessage({
      id: '2',
      channel: 'default',
      event: REALTIME_EVENT.FIXTURE_EVENTS_UPDATED,
      data: update,
    });

    expect(service.fixtureEventsUpdate()).toStrictEqual(update);
  });

  it('should ignore unknown realtime events', () => {
    service.connect();

    getEventSource().emitMessage({
      id: '3',
      channel: 'default',
      event: 'unknown.event',
      data: {},
    });

    expect(service.fixtureUpdate()).toBeNull();
    expect(service.fixtureEventsUpdate()).toBeNull();
  });

  it('should disconnect realtime and enable polling fallback', () => {
    service.connect();

    const eventSource = getEventSource();

    service.disconnect();

    expect(eventSource.close).toHaveBeenCalledTimes(1);
    expect(service.status()).toBe('disconnected');
    expect(liveRefreshServiceMock.start).toHaveBeenCalledTimes(1);
  });

  it('should allow reconnecting after disconnect', () => {
    service.connect();
    service.disconnect();
    service.connect();

    expect(MockEventSource.instances).toHaveLength(2);
  });

  function getEventSource(): MockEventSource {
    const eventSource = MockEventSource.instances[0];

    if (!eventSource) {
      throw new Error('EventSource not created');
    }

    return eventSource;
  }
});

type TestRealtimeEnvelope = {
  id: string;
  channel: string;
  event: string;
  data: unknown;
};

class MockEventSource {
  static instances: MockEventSource[] = [];

  readonly url: string;

  readonly close = jest.fn();

  onopen: ((event: Event) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;

  onmessage: ((event: MessageEvent<string>) => void) | null = null;

  constructor(url: string | URL) {
    this.url = url.toString();

    MockEventSource.instances.push(this);
  }

  emitOpen(): void {
    this.onopen?.(new Event('open'));
  }

  emitError(): void {
    this.onerror?.(new Event('error'));
  }

  emitMessage(message: TestRealtimeEnvelope): void {
    this.onmessage?.(
      new MessageEvent<string>('message', {
        data: JSON.stringify(message),
      })
    );
  }
}

function createFixtureUpdate(fixtureId: number): LiveFixtureUpdateDTO {
  return {
    fixtureId,
    operation: createOperationResponse<FixtureDTO>([
      {
        fixture: {
          id: fixtureId,
        },
      } as FixtureDTO,
    ]),
  };
}

function createFixtureEventsUpdate(
  fixtureId: number
): LiveFixtureEventsUpdateDTO {
  return {
    fixtureId,
    operation: createOperationResponse<RapidEventsDTO>([createRapidEvents()]),
  };
}
