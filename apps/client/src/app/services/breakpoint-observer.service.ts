import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

const SIZE_DEFAULT = 'Unknown';

@Injectable()
export class BreakpointObserverService {
  readonly currentSize = signal<string>(SIZE_DEFAULT);

  readonly breakpointsMap = new Map([
    [Breakpoints.XSmall, 'XSmall'],
    [Breakpoints.Small, 'Small'],
    [Breakpoints.Medium, 'Medium'],
    [Breakpoints.Large, 'Large'],
    [Breakpoints.XLarge, 'XLarge'],
  ]);

  constructor(breakpointObserver: BreakpointObserver) {
    breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
      ])
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

  isMobile(): boolean {
    return this.currentSize() === 'XSmall';
  }
}
