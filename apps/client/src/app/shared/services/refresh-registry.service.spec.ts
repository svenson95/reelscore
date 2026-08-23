import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  RefreshRegistryService,
  type RefreshTarget,
} from './refresh-registry.service';

describe('RefreshRegistryService', () => {
  let service: RefreshRegistryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RefreshRegistryService],
    });

    service = TestBed.inject(RefreshRegistryService);
  });

  describe('register', () => {
    it('should refresh a registered live target', async () => {
      const target = createTarget();

      service.register(target);

      const refreshed = await service.refresh();

      expect(refreshed).toBe(true);
      expect(target.refresh).toHaveBeenCalledTimes(1);
    });

    it('should unregister a target', async () => {
      const target = createTarget();

      const unregister = service.register(target);

      unregister();

      const refreshed = await service.refresh();

      expect(refreshed).toBe(false);
      expect(target.refresh).not.toHaveBeenCalled();
    });

    it('should replace a target with the same id', async () => {
      const firstTarget = createTarget({
        id: 'overview',
      });

      const secondTarget = createTarget({
        id: 'overview',
      });

      service.register(firstTarget);
      service.register(secondTarget);

      await service.refresh();

      expect(firstTarget.refresh).not.toHaveBeenCalled();
      expect(secondTarget.refresh).toHaveBeenCalledTimes(1);
    });

    it('should not unregister a newer target with the same id', async () => {
      const firstTarget = createTarget({
        id: 'overview',
      });

      const secondTarget = createTarget({
        id: 'overview',
      });

      const unregisterFirstTarget = service.register(firstTarget);

      service.register(secondTarget);

      unregisterFirstTarget();

      await service.refresh();

      expect(secondTarget.refresh).toHaveBeenCalledTimes(1);
    });
  });

  describe('refresh', () => {
    it('should refresh all live targets', async () => {
      const overviewTarget = createTarget({
        id: 'overview',
      });

      const matchTarget = createTarget({
        id: 'match:123',
      });

      service.register(overviewTarget);
      service.register(matchTarget);

      const refreshed = await service.refresh();

      expect(refreshed).toBe(true);
      expect(overviewTarget.refresh).toHaveBeenCalledTimes(1);
      expect(matchTarget.refresh).toHaveBeenCalledTimes(1);
    });

    it('should not refresh a target without live data', async () => {
      const target = createTarget({
        isLive: false,
      });

      service.register(target);

      const refreshed = await service.refresh();

      expect(refreshed).toBe(false);
      expect(target.refresh).not.toHaveBeenCalled();
    });

    it('should not refresh a target that cannot refresh', async () => {
      const target = createTarget({
        canRefresh: false,
      });

      service.register(target);

      const refreshed = await service.refresh();

      expect(refreshed).toBe(false);
      expect(target.refresh).not.toHaveBeenCalled();
    });

    it('should force refresh a target without live data', async () => {
      const target = createTarget({
        isLive: false,
      });

      service.register(target);

      const refreshed = await service.refresh({
        force: true,
      });

      expect(refreshed).toBe(true);
      expect(target.refresh).toHaveBeenCalledTimes(1);
    });

    it('should not force refresh a target that cannot refresh', async () => {
      const target = createTarget({
        isLive: false,
        canRefresh: false,
      });

      service.register(target);

      const refreshed = await service.refresh({
        force: true,
      });

      expect(refreshed).toBe(false);
      expect(target.refresh).not.toHaveBeenCalled();
    });

    it('should continue refreshing targets when one target fails', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const failingTarget = createTarget({
        id: 'overview',
        refresh: jest.fn().mockRejectedValue(new Error('Overview failed')),
      });

      const matchTarget = createTarget({
        id: 'match:123',
      });

      service.register(failingTarget);
      service.register(matchTarget);

      const refreshed = await service.refresh();

      expect(refreshed).toBe(true);
      expect(failingTarget.refresh).toHaveBeenCalledTimes(1);
      expect(matchTarget.refresh).toHaveBeenCalledTimes(1);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Live refresh failed for "overview"',
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });
  });

  const createTarget = ({
    id = 'overview',
    isLive = true,
    canRefresh = true,
    refresh = jest.fn(),
  }: {
    id?: string;
    isLive?: boolean;
    canRefresh?: boolean;
    refresh?: jest.Mock;
  } = {}): RefreshTarget => ({
    id,
    isLive: signal(isLive),
    canRefresh: signal(canRefresh),
    refresh,
  });
});
