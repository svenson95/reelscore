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
    jest.useFakeTimers();

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
    jest.useRealTimers();

    jest.restoreAllMocks();

    Object.defineProperty(globalThis, 'EventSource', {
      configurable: true,
      writable: true,
      value: originalEventSource,
    });
  });

  describe('initial state', () => {
    it('should initialize disconnected', () => {
      expect(service.status()).toBe('disconnected');
      expect(service.fixtureUpdate()).toBeNull();
      expect(service.fixtureEventsUpdate()).toBeNull();
    });
  });

  describe('connection', () => {
    it('should connect to the default realtime channel', () => {
      jest.spyOn(Date, 'now').mockReturnValue(1_788_000_000_000);

      service.connect();

      const url = new URL(getLatestEventSource().url);
      const expectedUrl = new URL(`${environment.api}livestream`);

      expect(service.status()).toBe('connecting');

      expect(url.origin).toBe(expectedUrl.origin);
      expect(url.pathname).toBe(expectedUrl.pathname);

      expect(url.searchParams.getAll('channel')).toEqual(['default']);
      expect(url.searchParams.get('last_ack_default')).toBe('1788000000000');
    });

    it('should not create multiple realtime connections', () => {
      service.connect();
      service.connect();

      expect(MockEventSource.instances).toHaveLength(1);
    });

    it('should stop fallback polling when realtime connects', () => {
      service.connect();

      const eventSource = getLatestEventSource();

      eventSource.emitOpen();

      expect(service.status()).toBe('connected');
      expect(liveRefreshServiceMock.stop).toHaveBeenCalledTimes(1);
    });
  });

  describe('messages', () => {
    it('should expose fixture updates', () => {
      const update = createFixtureUpdate(123);

      service.connect();

      getLatestEventSource().emitMessage({
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

      getLatestEventSource().emitMessage({
        id: '2',
        channel: 'default',
        event: REALTIME_EVENT.FIXTURE_EVENTS_UPDATED,
        data: update,
      });

      expect(service.fixtureEventsUpdate()).toStrictEqual(update);
    });

    it('should ignore unknown realtime events', () => {
      service.connect();

      getLatestEventSource().emitMessage({
        id: '3',
        channel: 'default',
        event: 'unknown.event',
        data: {},
      });

      expect(service.fixtureUpdate()).toBeNull();
      expect(service.fixtureEventsUpdate()).toBeNull();
    });

    it('should ignore invalid realtime messages', () => {
      jest.spyOn(console, 'warn').mockImplementation(() => undefined);

      service.connect();

      getLatestEventSource().emitRawMessage('invalid-json');

      expect(service.fixtureUpdate()).toBeNull();
      expect(service.fixtureEventsUpdate()).toBeNull();
    });
  });

  describe('reconnection', () => {
    it('should reconnect after a realtime connection error', () => {
      service.connect();

      const eventSource = getLatestEventSource();

      eventSource.emitOpen();
      eventSource.emitError();

      expect(eventSource.close).toHaveBeenCalledTimes(1);
      expect(MockEventSource.instances).toHaveLength(1);

      jest.advanceTimersByTime(1_000);

      expect(MockEventSource.instances).toHaveLength(2);
      expect(service.status()).toBe('connecting');
    });

    it('should let EventSource handle reconnect while it is connecting', () => {
      service.connect();

      const eventSource = getLatestEventSource();

      eventSource.emitError(MockEventSource.CONNECTING);

      jest.advanceTimersByTime(10_000);

      expect(MockEventSource.instances).toHaveLength(1);
      expect(eventSource.close).not.toHaveBeenCalled();
    });

    it('should use the last received event id when reconnecting', () => {
      service.connect();

      const firstEventSource = getLatestEventSource();

      firstEventSource.emitOpen();

      firstEventSource.emitMessage({
        id: '123-0',
        channel: 'default',
        event: REALTIME_EVENT.FIXTURE_UPDATED,
        data: createFixtureUpdate(123),
      });

      firstEventSource.emitError();

      jest.advanceTimersByTime(1_000);

      const secondEventSource = getLatestEventSource();

      const url = new URL(secondEventSource.url);

      expect(url.searchParams.get('last_ack_default')).toBe('123-0');
    });

    it('should reconnect when requested by the realtime server', () => {
      service.connect();

      const firstEventSource = getLatestEventSource();

      firstEventSource.emitRawMessage(
        JSON.stringify({
          type: 'reconnect',
          timestamp: 1_788_000_000_000,
        })
      );

      expect(firstEventSource.close).toHaveBeenCalledTimes(1);
      expect(MockEventSource.instances).toHaveLength(2);

      const secondEventSource = getLatestEventSource();
      const url = new URL(secondEventSource.url);

      expect(url.searchParams.get('last_ack_default')).toBe('1788000000000');
    });

    it('should reconnect when no realtime message is received within the timeout', () => {
      service.connect();

      const firstEventSource = getLatestEventSource();

      firstEventSource.emitOpen();

      jest.advanceTimersByTime(75_000);

      expect(firstEventSource.close).toHaveBeenCalledTimes(1);
      expect(MockEventSource.instances).toHaveLength(2);
    });

    it('should reset the connection timeout when a realtime message is received', () => {
      service.connect();

      const firstEventSource = getLatestEventSource();

      firstEventSource.emitOpen();

      jest.advanceTimersByTime(60_000);

      firstEventSource.emitRawMessage(
        JSON.stringify({
          type: 'ping',
          timestamp: Date.now(),
        })
      );

      jest.advanceTimersByTime(60_000);

      expect(MockEventSource.instances).toHaveLength(1);

      jest.advanceTimersByTime(15_000);

      expect(MockEventSource.instances).toHaveLength(2);
    });
  });

  describe('fallback', () => {
    it('should permanently fall back to polling after reaching the reconnect limit', () => {
      service.connect();

      getLatestEventSource().emitError();

      jest.advanceTimersByTime(1_000);

      getLatestEventSource().emitError();

      jest.advanceTimersByTime(2_000);

      getLatestEventSource().emitError();

      expect(service.status()).toBe('fallback');

      expect(MockEventSource.instances).toHaveLength(3);

      expect(liveRefreshServiceMock.start).toHaveBeenCalledTimes(1);

      expect(liveRefreshServiceMock.refresh).toHaveBeenCalledTimes(1);
      expect(liveRefreshServiceMock.refresh).toHaveBeenCalledWith({
        force: true,
      });
    });

    it('should not reconnect realtime after falling back to polling', () => {
      service.connect();

      getLatestEventSource().emitError();
      jest.advanceTimersByTime(1_000);

      getLatestEventSource().emitError();
      jest.advanceTimersByTime(2_000);

      getLatestEventSource().emitError();

      service.connect();
      service.connect();

      expect(service.status()).toBe('fallback');
      expect(MockEventSource.instances).toHaveLength(3);
    });
  });

  describe('disconnect', () => {
    it('should disconnect realtime and start polling fallback', () => {
      service.connect();

      const eventSource = getLatestEventSource();

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
  });

  function getLatestEventSource(): MockEventSource {
    const eventSource = MockEventSource.instances.at(-1);

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
  static readonly CONNECTING = 0;
  static readonly OPEN = 1;
  static readonly CLOSED = 2;

  static instances: MockEventSource[] = [];

  readonly CONNECTING = MockEventSource.CONNECTING;
  readonly OPEN = MockEventSource.OPEN;
  readonly CLOSED = MockEventSource.CLOSED;

  readonly url: string;

  readonly close = jest.fn(() => {
    this.readyState = MockEventSource.CLOSED;
  });

  readyState = MockEventSource.CONNECTING;

  onopen: ((event: Event) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  onmessage: ((event: MessageEvent<string>) => void) | null = null;

  constructor(url: string | URL) {
    this.url = url.toString();

    MockEventSource.instances.push(this);
  }

  emitOpen(): void {
    this.readyState = MockEventSource.OPEN;
    this.onopen?.(new Event('open'));
  }

  emitError(readyState = MockEventSource.CLOSED): void {
    this.readyState = readyState;
    this.onerror?.(new Event('error'));
  }

  emitMessage(message: TestRealtimeEnvelope): void {
    this.emitRawMessage(JSON.stringify(message));
  }

  emitRawMessage(data: string): void {
    this.onmessage?.(
      new MessageEvent<string>('message', {
        data,
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
