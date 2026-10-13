import { DOCUMENT } from '@angular/common';
import { DestroyRef, Directive, ElementRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';

import { filter } from 'rxjs';

const REPLAYABLE_ANIMATION_CLASSES = [
  'animate-drop-from-top',
  'animate-fade-in',
] as const;

@Directive({
  selector: '[rsReplayAnimationOnNavigation]',
  standalone: true,
})
export class ReplayAnimationOnNavigationDirective {
  private readonly element = inject(ElementRef<HTMLElement>);
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  private animationFrameId: number | null = null;

  constructor() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.replayAnimation());

    this.destroyRef.onDestroy(() => {
      if (this.animationFrameId !== null) {
        this.document.defaultView?.cancelAnimationFrame(this.animationFrameId);
      }
    });
  }

  private replayAnimation(): void {
    const browserWindow = this.document.defaultView;
    if (!browserWindow) return;

    const element = this.element.nativeElement;
    const activeClasses = REPLAYABLE_ANIMATION_CLASSES.filter((className) =>
      element.classList.contains(className)
    );

    if (activeClasses.length === 0) return;

    activeClasses.forEach((className) => element.classList.remove(className));

    this.animationFrameId = browserWindow.requestAnimationFrame(() => {
      activeClasses.forEach((className) => element.classList.add(className));
      this.animationFrameId = null;
    });
  }
}
