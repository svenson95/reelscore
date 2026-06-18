import { DOCUMENT } from '@angular/common';
import type { Signal } from '@angular/core';
import { Injectable, inject, signal } from '@angular/core';

export abstract class ThemeService {
  abstract isSystemDark: Signal<boolean>;
}

@Injectable({ providedIn: 'root' })
export class AbstractedThemeService {
  private readonly document = inject(DOCUMENT);

  private readonly darkThemeQuery = this.document.defaultView?.matchMedia(
    '(prefers-color-scheme: dark)'
  );

  private readonly isSystemDarkSignal = signal(
    this.darkThemeQuery?.matches ?? false
  );

  readonly isSystemDark = this.isSystemDarkSignal.asReadonly();

  constructor() {
    this.darkThemeQuery?.addEventListener('change', (event) => {
      this.isSystemDarkSignal.set(event.matches);
    });
  }
}

export const THEME_SERVICE_PROVIDER = {
  provide: ThemeService,
  useClass: AbstractedThemeService,
};
