import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Injectable, computed, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

const SIZE_DEFAULT = 'Unknown';

@Injectable({ providedIn: 'root' })
export class BreakpointObserverService {
  readonly currentSize = signal<string>(SIZE_DEFAULT);

  readonly isMobile = computed(() => this.currentSize() === 'XSmall');

  readonly breakpointsMap = new Map([
    [Breakpoints.XSmall, 'XSmall'],
    [Breakpoints.Small, 'Small'],
    [Breakpoints.Medium, 'Medium'],
    [Breakpoints.Large, 'Large'],
    [Breakpoints.XLarge, 'XLarge'],
  ]);

  constructor(breakpointObserver: BreakpointObserver) {
    const breakpoints = Array.from(this.breakpointsMap.keys());
    breakpointObserver
      .observe(breakpoints)
      .pipe(takeUntilDestroyed())
      .subscribe((result) => {
        for (const query of Object.keys(result.breakpoints)) {
          if (result.breakpoints[query]) {
            this.currentSize.set(
              this.breakpointsMap.get(query) ?? SIZE_DEFAULT
            );
          }
        }
      });
  }
}
