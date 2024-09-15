import {
  ActivatedRouteSnapshot,
  DetachedRouteHandle,
  RouteReuseStrategy,
} from '@angular/router';

export class CustomRouteReuseStrategy implements RouteReuseStrategy {
  handlers: { [key: string]: DetachedRouteHandle } = {};
  shouldReuse = (route: ActivatedRouteSnapshot) => route.data['shouldReuse'];

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return route.data['shouldReuse'] || false;
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    const path = route.routeConfig?.path;
    if (this.shouldReuse(route) && path) {
      this.handlers[path] = handle;
    }
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const path = route.routeConfig?.path;
    if (path) {
      return !!route.routeConfig && !!this.handlers[path];
    } else {
      return false;
    }
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    const path = route.routeConfig?.path;
    if (!route.routeConfig || path === undefined) return null;
    return this.handlers[path];
  }

  shouldReuseRoute(
    future: ActivatedRouteSnapshot,
    curr: ActivatedRouteSnapshot
  ): boolean {
    return future.data['shouldReuse'] || false;
  }
}

export const CUSTOM_ROUTE_REUSE_STRATEGY_PROVIDER = {
  provide: RouteReuseStrategy,
  useClass: CustomRouteReuseStrategy,
};
