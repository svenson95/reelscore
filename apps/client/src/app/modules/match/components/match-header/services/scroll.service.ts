import { computed, ElementRef, Injectable, signal } from '@angular/core';

@Injectable()
export class ScrollService {
  private destroyScrollListener?: () => void;
  private resizeObserver?: ResizeObserver;
  scrollFrame: number | null = null;

  private readonly scrollY = signal<number>(window.scrollY);
  private readonly initialScrollY = signal<number>(window.scrollY);
  private readonly highlightsHeight = signal<number>(0);

  private readonly scrollProgress = computed<number>(() => {
    const height = this.highlightsHeight();

    if (height === 0) {
      return 0;
    }

    const scrolled = Math.max(0, this.scrollY() - this.initialScrollY());

    return Math.min(1, scrolled / height);
  });

  readonly highlightsVisibleHeight = computed<number>(() => {
    const height = this.highlightsHeight();

    if (height === 0) {
      return 0;
    }

    return height * (1 - this.scrollProgress());
  });

  readonly highlightsOpacity = computed<string>(() => {
    return `${1 - this.scrollProgress()}`;
  });

  observeScrollPosition(): void {
    const onScroll = () => {
      if (this.scrollFrame !== null) {
        return;
      }

      this.scrollFrame = requestAnimationFrame(() => {
        this.setScrollY(window.scrollY);
        this.scrollFrame = null;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    this.destroyScrollListener = () => {
      window.removeEventListener('scroll', onScroll);
    };
  }

  destroy(): void {
    this.destroyScrollListener?.();

    if (this.scrollFrame !== null) {
      cancelAnimationFrame(this.scrollFrame);
    }

    this.resizeObserver?.disconnect();
  }

  setScrollY(value: number): void {
    this.scrollY.set(value);
  }

  setHighlightsContent(ref: ElementRef<HTMLElement> | undefined): void {
    this.resizeObserver?.disconnect();

    if (!ref) {
      this.highlightsHeight.set(0);
      return;
    }

    const element = ref.nativeElement;

    const updateHeight = () => {
      this.highlightsHeight.set(element.scrollHeight);
    };

    updateHeight();

    this.resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(updateHeight);
    });

    this.resizeObserver.observe(element);

    this.initialScrollY.set(window.scrollY);
    this.scrollY.set(window.scrollY);
  }
}
