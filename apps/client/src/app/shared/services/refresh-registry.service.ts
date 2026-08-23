import { Injectable, type Signal } from '@angular/core';

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
  private readonly targets = new Map<string, RefreshTarget>();

  register(target: RefreshTarget): () => void {
    this.targets.set(target.id, target);

    return () => {
      if (this.targets.get(target.id) === target) {
        this.targets.delete(target.id);
      }
    };
  }

  async refresh(options?: RefreshOptions): Promise<boolean> {
    const refreshTargets = [...this.targets.values()].filter(
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
