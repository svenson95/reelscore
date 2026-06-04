import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import type { Signal, WritableSignal } from '@angular/core';
import { Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

const SIZE_DEFAULT = 'Unknown';

const BREAKPOINTS = new Map([
  [Breakpoints.XSmall, 'XSmall'],
  [Breakpoints.Small, 'Small'],
  [Breakpoints.Medium, 'Medium'],
  [Breakpoints.Large, 'Large'],
  [Breakpoints.XLarge, 'XLarge'],
]);

export abstract class BreakpointObserverService {
  abstract currentSize: WritableSignal<string>;
  abstract isMobile: Signal<boolean>;
}

@Injectable()
export class AbstractedBreakpointObserverService extends BreakpointObserverService {
  private readonly breakpointObserver = inject(BreakpointObserver);
  readonly currentSize = signal<string>(SIZE_DEFAULT);

  readonly isMobile = computed(() => this.currentSize() === 'XSmall');

  constructor() {
    super();
    this.breakpointObserver
      .observe(Array.from(BREAKPOINTS.keys()))
      .pipe(takeUntilDestroyed())
      .subscribe((result) => {
        for (const query of Object.keys(result.breakpoints)) {
          if (result.breakpoints[query]) {
            this.currentSize.set(BREAKPOINTS.get(query) ?? SIZE_DEFAULT);
          }
        }
      });
  }
}

export const BREAKPOINT_OBSERVER_SERVICE_PROVIDER = {
  provide: BreakpointObserverService,
  useClass: AbstractedBreakpointObserverService,
};
