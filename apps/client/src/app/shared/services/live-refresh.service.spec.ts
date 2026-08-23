import { TestBed } from '@angular/core/testing';

import {
  LiveRefreshService,
  REFRESH_INTERVAL_SECONDS,
} from './live-refresh.service';
import { RefreshRegistryService } from './refresh-registry.service';

describe('LiveRefreshService', () => {
  let service: LiveRefreshService;

  const refreshRegistryMock = {
    refresh: jest.fn(),
  };

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-08-23T12:00:00Z'));

    refreshRegistryMock.refresh.mockReset();
    refreshRegistryMock.refresh.mockResolvedValue(true);

    TestBed.configureTestingModule({
      providers: [
        LiveRefreshService,
        {
          provide: RefreshRegistryService,
          useValue: refreshRegistryMock,
        },
      ],
    });

    service = TestBed.inject(LiveRefreshService);
  });

  afterEach(() => {
    service.stop();
    jest.useRealTimers();
  });

  describe('lifecycle', () => {
    it('should start the global refresh timer', () => {
      service.start();

      expect(service.isRunning()).toBe(true);
      expect(service.timer()).toBe(REFRESH_INTERVAL_SECONDS);
    });

    it('should not start multiple timers', async () => {
      service.start();
      service.start();

      await jest.advanceTimersByTimeAsync(1_000);

      expect(service.timer()).toBe(REFRESH_INTERVAL_SECONDS - 1);
    });

    it('should stop and reset the timer', async () => {
      service.start();

      await jest.advanceTimersByTimeAsync(5_000);

      expect(service.timer()).toBe(REFRESH_INTERVAL_SECONDS - 5);

      service.stop();

      expect(service.isRunning()).toBe(false);
      expect(service.timer()).toBe(REFRESH_INTERVAL_SECONDS);
    });

    it('should not continue counting down after stop', async () => {
      service.start();

      await jest.advanceTimersByTimeAsync(5_000);

      service.stop();

      await jest.advanceTimersByTimeAsync(5_000);

      expect(service.timer()).toBe(REFRESH_INTERVAL_SECONDS);
    });
  });

  describe('refresh', () => {
    it('should refresh registered targets', async () => {
      const refreshed = await service.refresh();

      expect(refreshed).toBe(true);
      expect(refreshRegistryMock.refresh).toHaveBeenCalledWith(undefined);
    });

    it('should forward force refresh option', async () => {
      await service.refresh({
        force: true,
      });

      expect(refreshRegistryMock.refresh).toHaveBeenCalledWith({
        force: true,
      });
    });

    it('should expose refreshing state while refresh is running', async () => {
      let resolveRefresh!: (value: boolean) => void;

      refreshRegistryMock.refresh.mockImplementation(
        () =>
          new Promise<boolean>((resolve) => {
            resolveRefresh = resolve;
          })
      );

      const refreshPromise = service.refresh();

      expect(service.isRefreshing()).toBe(true);

      resolveRefresh(true);
      await refreshPromise;

      expect(service.isRefreshing()).toBe(false);
    });

    it('should prevent overlapping refreshes', async () => {
      let resolveRefresh!: (value: boolean) => void;

      refreshRegistryMock.refresh.mockImplementation(
        () =>
          new Promise<boolean>((resolve) => {
            resolveRefresh = resolve;
          })
      );

      const firstRefresh = service.refresh();
      const secondRefresh = service.refresh();

      expect(refreshRegistryMock.refresh).toHaveBeenCalledTimes(1);

      await expect(secondRefresh).resolves.toBe(false);

      resolveRefresh(true);

      await expect(firstRefresh).resolves.toBe(true);
    });

    it('should prevent refresh within the minimum refresh interval', async () => {
      await service.refresh();

      await jest.advanceTimersByTimeAsync(10_000);

      const refreshed = await service.refresh();

      expect(refreshed).toBe(false);
      expect(refreshRegistryMock.refresh).toHaveBeenCalledTimes(1);
    });

    it('should allow refresh after the minimum refresh interval', async () => {
      await service.refresh();

      await jest.advanceTimersByTimeAsync(REFRESH_INTERVAL_SECONDS * 1000);

      const refreshed = await service.refresh();

      expect(refreshed).toBe(true);
      expect(refreshRegistryMock.refresh).toHaveBeenCalledTimes(2);
    });

    it('should not start cooldown when no target was refreshed', async () => {
      refreshRegistryMock.refresh
        .mockResolvedValueOnce(false)
        .mockResolvedValueOnce(true);

      const firstRefresh = await service.refresh();
      const secondRefresh = await service.refresh();

      expect(firstRefresh).toBe(false);
      expect(secondRefresh).toBe(true);
      expect(refreshRegistryMock.refresh).toHaveBeenCalledTimes(2);
    });

    it('should reset timer after successful refresh', async () => {
      service.start();

      await jest.advanceTimersByTimeAsync(5_000);

      expect(service.timer()).toBe(REFRESH_INTERVAL_SECONDS - 5);

      await service.refresh();

      expect(service.timer()).toBe(REFRESH_INTERVAL_SECONDS);
    });

    it('should clear refreshing state when registry refresh fails', async () => {
      refreshRegistryMock.refresh.mockRejectedValue(
        new Error('Refresh failed')
      );

      await expect(service.refresh()).rejects.toThrow('Refresh failed');

      expect(service.isRefreshing()).toBe(false);
    });
  });

  describe('timer', () => {
    it('should count down every second', async () => {
      service.start();

      await jest.advanceTimersByTimeAsync(5_000);

      expect(service.timer()).toBe(REFRESH_INTERVAL_SECONDS - 5);
    });

    it('should trigger refresh after the refresh interval', async () => {
      service.start();

      await jest.advanceTimersByTimeAsync(REFRESH_INTERVAL_SECONDS * 1000);

      expect(refreshRegistryMock.refresh).toHaveBeenCalledTimes(1);

      await Promise.resolve();

      expect(service.timer()).toBe(REFRESH_INTERVAL_SECONDS);
    });

    it('should pause countdown while refreshing', async () => {
      let resolveRefresh!: (value: boolean) => void;

      refreshRegistryMock.refresh.mockImplementation(
        () =>
          new Promise<boolean>((resolve) => {
            resolveRefresh = resolve;
          })
      );

      service.start();

      const refreshPromise = service.refresh();

      await jest.advanceTimersByTimeAsync(5_000);

      expect(service.timer()).toBe(REFRESH_INTERVAL_SECONDS);

      resolveRefresh(true);
      await refreshPromise;

      await jest.advanceTimersByTimeAsync(1_000);

      expect(service.timer()).toBe(REFRESH_INTERVAL_SECONDS - 1);
    });
  });
});
