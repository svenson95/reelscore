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

    it('should stop and reset the timer when no fixture is playing anymore', async () => {
      const isPlaying = signal(true);
      const canRefresh = signal(true);

      service.init({
        isPlaying,
        canRefresh,
        refresh: jest.fn(),
      });

      TestBed.tick();

      await jest.advanceTimersByTimeAsync(5_000);

      expect(service.timer()).toBe(REFRESH_INTERVAL_SECONDS - 5);

      isPlaying.set(false);
      TestBed.tick();

      expect(service.isRunning()).toBe(false);
      expect(service.timer()).toBe(REFRESH_INTERVAL_SECONDS);
    });

    it('should stop, reset the timer and clear its page context', async () => {
      const isPlaying = signal(true);
      const canRefresh = signal(true);

      service.init({
        isPlaying,
        canRefresh,
        refresh: jest.fn(),
      });

      TestBed.tick();

      await jest.advanceTimersByTimeAsync(5_000);

      expect(service.timer()).toBe(REFRESH_INTERVAL_SECONDS - 5);

      service.stop();

      expect(service.isRunning()).toBe(false);
      expect(service.timer()).toBe(REFRESH_INTERVAL_SECONDS);

      isPlaying.set(false);
      TestBed.tick();

      isPlaying.set(true);
      TestBed.tick();

      expect(service.isRunning()).toBe(false);
    });

    it('should pause and preserve the current timer value', async () => {
      const isPlaying = signal(true);
      const canRefresh = signal(true);

      service.init({
        isPlaying,
        canRefresh,
        refresh: jest.fn(),
      });

      TestBed.tick();

      await jest.advanceTimersByTimeAsync(5_000);

      expect(service.timer()).toBe(REFRESH_INTERVAL_SECONDS - 5);

      service.pause();

      expect(service.isRunning()).toBe(false);
      expect(service.timer()).toBe(REFRESH_INTERVAL_SECONDS - 5);
    });

    it('should resume from the preserved timer value after pause', async () => {
      const isPlaying = signal(true);
      const canRefresh = signal(true);
      const refresh = jest.fn();

      const options = {
        isPlaying,
        canRefresh,
        refresh,
      };

      service.init(options);

      TestBed.tick();

      await jest.advanceTimersByTimeAsync(5_000);

      expect(service.timer()).toBe(REFRESH_INTERVAL_SECONDS - 5);

      service.pause();

      await jest.advanceTimersByTimeAsync(3_000);

      expect(service.timer()).toBe(REFRESH_INTERVAL_SECONDS - 5);

      service.init(options);

      TestBed.tick();

      expect(service.isRunning()).toBe(true);
      expect(service.timer()).toBe(REFRESH_INTERVAL_SECONDS - 5);

      await jest.advanceTimersByTimeAsync(1_000);

      expect(service.timer()).toBe(REFRESH_INTERVAL_SECONDS - 6);
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

    it('should not continue counting down or refresh while paused', async () => {
      const isPlaying = signal(true);
      const canRefresh = signal(true);
      const refresh = jest.fn();

      service.init({
        isPlaying,
        canRefresh,
        refresh,
      });

      TestBed.tick();

      await jest.advanceTimersByTimeAsync(5_000);

      const remainingTime = service.timer();

      service.pause();

      await jest.advanceTimersByTimeAsync(REFRESH_INTERVAL_SECONDS * 2 * 1000);

      expect(service.timer()).toBe(remainingTime);
      expect(service.isRunning()).toBe(false);
      expect(refresh).not.toHaveBeenCalled();
    });
  });
});
