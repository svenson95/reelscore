import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {
  Injectable,
  Signal,
  WritableSignal,
  computed,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

const SIZE_DEFAULT = 'Unknown';
const IS_MOBILE_SIZE = Breakpoints.XSmall;

export abstract class BreakpointObserverService {
  abstract currentSize: WritableSignal<string>;
  abstract isMobile: Signal<boolean>;
}

@Injectable()
export class AbstractedBreakpointObserverService extends BreakpointObserverService {
  currentSize = signal<string>(SIZE_DEFAULT);

  isMobile = computed(() => this.currentSize() === IS_MOBILE_SIZE);

  constructor(breakpointObserver: BreakpointObserver) {
    super();

    const breakpoints = new Map([
      [Breakpoints.XSmall, 'XSmall'],
      [Breakpoints.Small, 'Small'],
      [Breakpoints.Medium, 'Medium'],
      [Breakpoints.Large, 'Large'],
      [Breakpoints.XLarge, 'XLarge'],
    ]);
    breakpointObserver
      .observe(Array.from(breakpoints.keys()))
      .pipe(takeUntilDestroyed())
      .subscribe((result) => {
        for (const query of Object.keys(result.breakpoints)) {
          if (result.breakpoints[query]) {
            this.currentSize.set(breakpoints.get(query) ?? SIZE_DEFAULT);
          }
        }
      });
  }
}

export const BREAKPOINT_OBSERVER_SERVICE_PROVIDER = {
  provide: BreakpointObserverService,
  useClass: AbstractedBreakpointObserverService,
};
