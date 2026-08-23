import type {
  ActivatedRouteSnapshot,
  DetachedRouteHandle,
  Route,
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
  private readonly handlers = new Map<Route, DetachedRouteHandle>();

  shouldReuse = (route: ActivatedRouteSnapshot): boolean =>
    route.data['shouldReuse'] === true;

  store(
    route: ActivatedRouteSnapshot,
    handle: DetachedRouteHandle | null
  ): void {
    const routeConfig = route.routeConfig;

    if (!this.shouldReuse(route) || !routeConfig || !handle) {
      return;
    }

    const reusableHandle = handle as ReusableHandle;

    reusableHandle.componentRef?.instance?.onRouteDetach?.();

    this.handlers.set(routeConfig, handle);
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    const routeConfig = route.routeConfig;

    if (!routeConfig) {
      return null;
    }

    const handle = this.handlers.get(routeConfig) ?? null;

    if (handle) {
      const reusableHandle = handle as ReusableHandle;

      reusableHandle.componentRef?.instance?.onRouteAttach?.();
    }

    return handle;
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const routeConfig = route.routeConfig;

    return !!routeConfig && this.handlers.has(routeConfig);
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
