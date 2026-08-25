import { computed, Injectable, signal, type Signal } from '@angular/core';

export type RefreshTarget = {
  id: string;
  isLive: Signal<boolean>;
  canRefresh: Signal<boolean>;
  refresh: () => void | Promise<void>;
};

type RefreshOptions = {
  force?: boolean;
};

@Injectable({ providedIn: 'root' })
export class RefreshRegistryService {
  private readonly targets = signal<Map<string, RefreshTarget>>(
    new Map<string, RefreshTarget>()
  );

  readonly hasLiveTargets = computed<boolean>(() =>
    [...this.targets().values()].some((target) => target.isLive())
  );

  register(target: RefreshTarget): () => void {
    this.targets.update((targets) => {
      const updated = new Map(targets);

      updated.set(target.id, target);

      return updated;
    });

    return () => {
      this.targets.update((targets) => {
        if (targets.get(target.id) !== target) {
          return targets;
        }

        const updated = new Map(targets);

        updated.delete(target.id);

        return updated;
      });
    };
  }

  async refresh(options?: RefreshOptions): Promise<boolean> {
    const refreshTargets = [...this.targets().values()].filter(
      (target) => target.canRefresh() && (options?.force || target.isLive())
    );

    if (!refreshTargets.length) {
      return false;
    }

    const results = await Promise.allSettled(
      refreshTargets.map((target) => target.refresh())
    );

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        return;
      }

      console.error(
        `Live refresh failed for "${refreshTargets[index].id}"`,
        result.reason
      );
    });

    return true;
  }
}
