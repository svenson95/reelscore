import { computed, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  AbstractedPageRefreshService,
  REFRESH_INTERVAL_SECONDS,
} from './page-refresh.service';

describe('PageRefreshService', () => {
  let service: AbstractedPageRefreshService;

  beforeEach(() => {
    jest.useFakeTimers();

    TestBed.configureTestingModule({
      providers: [AbstractedPageRefreshService],
    });

    service = TestBed.inject(AbstractedPageRefreshService);
  });

  afterEach(() => {
    service.stop();
    jest.useRealTimers();
  });

  describe('lifecycle', () => {
    it('should not start without playing fixtures', () => {
      const isPlaying = signal(false);
      const canRefresh = signal(true);

      service.init({
        isPlaying,
        canRefresh,
        refresh: jest.fn(),
      });

      TestBed.tick();

      expect(service.isRunning()).toBe(false);
      expect(service.timer()).toBe(REFRESH_INTERVAL_SECONDS);
    });

    it('should start when fixtures become playing', () => {
      const isPlaying = signal(false);
      const canRefresh = signal(true);

      service.init({
        isPlaying,
        canRefresh,
        refresh: jest.fn(),
      });

      TestBed.tick();

      isPlaying.set(true);
      TestBed.tick();

      expect(service.isRunning()).toBe(true);
    });

    it('should stop when no fixture is playing anymore', () => {
      const isPlaying = signal(true);
      const canRefresh = signal(true);

      service.init({
        isPlaying,
        canRefresh,
        refresh: jest.fn(),
      });

      TestBed.tick();

      expect(service.isRunning()).toBe(true);

      isPlaying.set(false);
      TestBed.tick();

      expect(service.isRunning()).toBe(false);
      expect(service.timer()).toBe(REFRESH_INTERVAL_SECONDS);
    });

    it('should stop and clear its page context', () => {
      const isPlaying = signal(true);
      const canRefresh = signal(true);

      service.init({
        isPlaying,
        canRefresh,
        refresh: jest.fn(),
      });

      TestBed.tick();

      expect(service.isRunning()).toBe(true);

      service.stop();

      expect(service.isRunning()).toBe(false);

      isPlaying.set(false);
      TestBed.tick();

      isPlaying.set(true);
      TestBed.tick();

      expect(service.isRunning()).toBe(false);
    });
  });

  describe('refresh', () => {
    it('should stop the timer while refreshing', async () => {
      const isPlaying = signal(true);
      const canRefresh = signal(true);

      let resolveRefresh!: () => void;

      const refresh = jest.fn(
        () =>
          new Promise<void>((resolve) => {
            resolveRefresh = resolve;
          })
      );

      service.init({
        isPlaying,
        canRefresh,
        refresh,
      });

      TestBed.tick();

      expect(service.isRunning()).toBe(true);

      const refreshPromise = service.refresh();

      expect(service.isRunning()).toBe(false);
      expect(refresh).toHaveBeenCalledTimes(1);

      resolveRefresh();
      await refreshPromise;
    });

    it('should restart when refresh requests finish', async () => {
      const isPlaying = signal(true);
      const isPending = signal(false);
      const canRefresh = computed(() => !isPending());

      const refresh = jest.fn(async () => {
        isPending.set(true);
      });

      service.init({
        isPlaying,
        canRefresh,
        refresh,
      });

      TestBed.tick();

      expect(service.isRunning()).toBe(true);

      await service.refresh();

      expect(refresh).toHaveBeenCalledTimes(1);
      expect(service.isRunning()).toBe(false);

      isPending.set(false);
      TestBed.tick();

      expect(service.isRunning()).toBe(true);
    });

    it('should not refresh while requests are pending', async () => {
      const isPlaying = signal(true);
      const isPending = signal(true);
      const canRefresh = computed(() => !isPending());
      const refresh = jest.fn();

      service.init({
        isPlaying,
        canRefresh,
        refresh,
      });

      TestBed.tick();

      await service.refresh();

      expect(refresh).not.toHaveBeenCalled();
    });
  });

  describe('timer', () => {
    it('should trigger refresh after the refresh interval', async () => {
      const isPlaying = signal(true);
      const canRefresh = signal(true);
      const refresh = jest.fn().mockResolvedValue(undefined);

      service.init({
        isPlaying,
        canRefresh,
        refresh,
      });

      TestBed.tick();

      expect(service.isRunning()).toBe(true);

      await jest.advanceTimersByTimeAsync(REFRESH_INTERVAL_SECONDS * 1000);

      expect(refresh).toHaveBeenCalledTimes(1);
    });
  });
});
