import { DOCUMENT } from '@angular/common';
import type { Signal } from '@angular/core';
import { DestroyRef, Injectable, inject, signal } from '@angular/core';

export abstract class ThemeService {
  abstract isSystemDark: Signal<boolean>;
}

@Injectable()
export class AbstractedThemeService implements ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  private readonly darkThemeQuery = this.document.defaultView?.matchMedia(
    '(prefers-color-scheme: dark)'
  );

  private readonly isSystemDarkSignal = signal(
    this.darkThemeQuery?.matches ?? false
  );

  readonly isSystemDark = this.isSystemDarkSignal.asReadonly();

  constructor() {
    const onThemeChange = (event: MediaQueryListEvent): void => {
      this.isSystemDarkSignal.set(event.matches);
    };

    this.darkThemeQuery?.addEventListener('change', onThemeChange);

    this.destroyRef.onDestroy(() => {
      this.darkThemeQuery?.removeEventListener('change', onThemeChange);
    });
  }
}

export const THEME_SERVICE_PROVIDER = {
  provide: ThemeService,
  useClass: AbstractedThemeService,
};
