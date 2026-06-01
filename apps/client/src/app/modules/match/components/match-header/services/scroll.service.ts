import {
  DestroyRef,
  ElementRef,
  Injectable,
  NgZone,
  inject,
} from '@angular/core';

@Injectable()
export class ScrollService {
  private readonly ngZone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);

  private wrapper?: HTMLElement;
  private content?: HTMLElement;

  private resizeObserver?: ResizeObserver;
  private destroyScrollListener?: () => void;

  private scrollFrame: number | null = null;
  private initialScrollY = 0;
  private highlightsHeight = 0;

  setAnimationWrapper(ref: ElementRef<HTMLElement> | undefined): void {
    this.wrapper = ref?.nativeElement;
    this.updateCssVariables();
  }

  setHighlightsContent(ref: ElementRef<HTMLElement> | undefined): void {
    this.resizeObserver?.disconnect();
    this.content = ref?.nativeElement;

    if (!this.content) {
      this.highlightsHeight = 0;
      this.updateCssVariables();
      return;
    }

    this.measureHeight();

    this.resizeObserver = new ResizeObserver(() => {
      this.requestUpdate(() => {
        this.measureHeight();
        this.updateProgress();
      });
    });

    this.resizeObserver.observe(this.content);
  }

  observeScrollPosition(): void {
    this.ngZone.runOutsideAngular(() => {
      this.initialScrollY = this.getScrollY();

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

    this.resizeObserver?.disconnect();
    this.resizeObserver = undefined;

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
    if (!this.content) {
      this.highlightsHeight = 0;
      this.updateCssVariables();
      return;
    }

    this.highlightsHeight = this.content.scrollHeight;
    this.updateCssVariables();
  }

  private updateProgress(): void {
    if (!this.wrapper || this.highlightsHeight <= 0) {
      return;
    }

    const scrolled = Math.max(0, this.getScrollY() - this.initialScrollY);
    const progress = Math.min(1, scrolled / this.highlightsHeight);

    this.wrapper.style.setProperty('--highlights-progress', `${progress}`);
  }

  private updateCssVariables(): void {
    if (!this.wrapper) {
      return;
    }

    this.wrapper.style.setProperty(
      '--highlights-height',
      `${this.highlightsHeight}px`
    );
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
