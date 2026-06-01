import { computed, ElementRef, Injectable, signal } from '@angular/core';

@Injectable()
export class ScrollService {
  private resizeObserver?: ResizeObserver;

  private readonly scrollY = signal<number>(window.scrollY);
  private readonly initialScrollY = signal<number>(window.scrollY);

  destroyScrollListener?: () => void;
  scrollFrame: number | null = null;

  readonly highlightsHeight = signal<number>(0);

  readonly scrollProgress = computed<number>(() => {
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

  disconnectObserver(): void {
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
