import type {
  ActivatedRouteSnapshot,
  DetachedRouteHandle,
} from '@angular/router';
import { RouteReuseStrategy } from '@angular/router';

export interface RouteReuseLifecycle {
  onRouteDetach?(): void;
  onRouteAttach?(): void;
}

type ReusableHandle = DetachedRouteHandle & {
  componentRef?: {
    instance?: RouteReuseLifecycle;
  };
};

export class CustomRouteReuseStrategy implements RouteReuseStrategy {
  private handlers: { [key: string]: DetachedRouteHandle } = {};

  shouldReuse = (route: ActivatedRouteSnapshot): boolean =>
    route.data['shouldReuse'] === true;

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    const path = route.routeConfig?.path;

    if (this.shouldReuse(route) && path) {
      const reusableHandle = handle as ReusableHandle;
      reusableHandle.componentRef?.instance?.onRouteDetach?.();

      this.handlers[path] = handle;
    }
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    const path = route.routeConfig?.path;
    if (!route.routeConfig || path === undefined) return null;

    const handle = this.handlers[path] ?? null;

    if (handle) {
      const reusableHandle = handle as ReusableHandle;
      reusableHandle.componentRef?.instance?.onRouteAttach?.();
    }

    return handle;
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const path = route.routeConfig?.path;
    return !!path && !!this.handlers[path];
  }

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return this.shouldReuse(route);
  }

  shouldReuseRoute(
    future: ActivatedRouteSnapshot,
    curr: ActivatedRouteSnapshot
  ): boolean {
    return future.routeConfig === curr.routeConfig;
  }
}

export const CUSTOM_ROUTE_REUSE_STRATEGY_PROVIDER = {
  provide: RouteReuseStrategy,
  useClass: CustomRouteReuseStrategy,
};
