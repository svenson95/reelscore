import type { ElementRef } from '@angular/core';
import {
  computed,
  DestroyRef,
  inject,
  Injectable,
  NgZone,
  signal,
} from '@angular/core';

@Injectable()
export class ScrollService {
  private readonly ngZone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);

  private wrapper?: HTMLElement;
  private scrollFrame: number | null = null;
  private destroyScrollListener?: () => void;

  private initialScrollY = 0;

  private readonly highlightsHeight = signal<number>(0);
  private readonly highlightsProgress = signal<number>(0);

  readonly hasVisibleHeight = computed(() => {
    console.log('value', this.highlightsProgress());
    return this.highlightsHeight() > 0 && this.highlightsProgress() < 1;
  });

  setAnimationWrapper(ref: ElementRef<HTMLElement> | null): void {
    this.wrapper = ref?.nativeElement;

    if (!this.wrapper) {
      this.highlightsHeight.set(0);
      return;
    }

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
      this.highlightsHeight.set(0);
      this.highlightsProgress.set(0);
      return;
    }

    const height = this.wrapper.scrollHeight;

    this.highlightsHeight.set(height);

    this.wrapper.style.setProperty('--highlights-height', `${height}px`);
  }

  private updateProgress(): void {
    const highlightsHeight = this.highlightsHeight();

    if (!this.wrapper || highlightsHeight <= 0) {
      this.highlightsProgress.set(0);
      return;
    }

    const scrolled = Math.max(0, this.getScrollY() - this.initialScrollY);
    const progress = Math.min(1, scrolled / highlightsHeight);

    this.highlightsProgress.set(progress);

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
