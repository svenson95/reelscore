import type { ElementRef } from '@angular/core';
import { DestroyRef, Injectable, NgZone, inject } from '@angular/core';

@Injectable()
export class ScrollService {
  private readonly ngZone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);

  private wrapper?: HTMLElement;
  private scrollFrame: number | null = null;
  private destroyScrollListener?: () => void;

  private initialScrollY = 0;
  private highlightsHeight = 0;

  setAnimationWrapper(ref: ElementRef<HTMLElement> | null): void {
    this.wrapper = ref?.nativeElement;

    this.requestUpdate(() => {
      this.measureHeight();
      this.updateProgress();
    });
  }

  observeScrollPosition(): void {
    this.ngZone.runOutsideAngular(() => {
      this.initialScrollY = this.getScrollY();

      this.requestUpdate(() => {
        this.measureHeight();
        this.updateProgress();
      });

      const onScroll = () => {
        this.requestUpdate(() => {
          this.updateProgress();
        });
      };

      const onResize = () => {
        this.requestUpdate(() => {
          this.measureHeight();
          this.updateProgress();
        });
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onResize, { passive: true });
      window.addEventListener('orientationchange', onResize, { passive: true });

      window.visualViewport?.addEventListener('scroll', onScroll, {
        passive: true,
      });

      window.visualViewport?.addEventListener('resize', onResize, {
        passive: true,
      });

      this.destroyScrollListener = () => {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onResize);
        window.removeEventListener('orientationchange', onResize);

        window.visualViewport?.removeEventListener('scroll', onScroll);
        window.visualViewport?.removeEventListener('resize', onResize);
      };

      this.destroyRef.onDestroy(() => this.destroy());
    });
  }

  destroy(): void {
    this.destroyScrollListener?.();
    this.destroyScrollListener = undefined;

    if (this.scrollFrame !== null) {
      cancelAnimationFrame(this.scrollFrame);
      this.scrollFrame = null;
    }
  }

  private requestUpdate(callback: () => void): void {
    if (this.scrollFrame !== null) {
      return;
    }

    this.scrollFrame = requestAnimationFrame(() => {
      callback();
      this.scrollFrame = null;
    });
  }

  private measureHeight(): void {
    if (!this.wrapper) {
      this.highlightsHeight = 0;
      return;
    }

    this.highlightsHeight = this.wrapper.scrollHeight;

    this.wrapper.style.setProperty(
      '--highlights-height',
      `${this.highlightsHeight}px`
    );
  }

  private updateProgress(): void {
    if (!this.wrapper || this.highlightsHeight <= 0) {
      return;
    }

    const scrolled = Math.max(0, this.getScrollY() - this.initialScrollY);
    const progress = Math.min(1, scrolled / this.highlightsHeight);

    this.wrapper.style.setProperty('--highlights-progress', `${progress}`);
  }

  private getScrollY(): number {
    return (
      window.scrollY ||
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0
    );
  }
}
