import { Directive, output } from '@angular/core';

export type TabSwipeDirection = -1 | 1;

@Directive({
  selector: '[rsTabSwipe]',
  host: {
    '(pointerdown)': 'startSwipe($event)',
    '(pointerup)': 'finishSwipe($event)',
    '(pointercancel)': 'cancelSwipe()',
  },
})
export class TabSwipeDirective {
  readonly tabSwipe = output<TabSwipeDirection>();

  private startX: number | null = null;
  private startY: number | null = null;
  private pointerId: number | null = null;

  protected startSwipe(event: PointerEvent): void {
    if (
      event.pointerType !== 'touch' ||
      this.isInteractiveTarget(event.target)
    ) {
      return;
    }

    this.startX = event.clientX;
    this.startY = event.clientY;
    this.pointerId = event.pointerId;
  }

  protected finishSwipe(event: PointerEvent): void {
    if (event.pointerId !== this.pointerId || this.startX === null) return;

    const horizontalDistance = event.clientX - this.startX;
    const verticalDistance = event.clientY - (this.startY ?? event.clientY);
    const isHorizontalSwipe =
      Math.abs(horizontalDistance) >= 48 &&
      Math.abs(horizontalDistance) > Math.abs(verticalDistance) * 1.2;

    this.cancelSwipe();

    if (!isHorizontalSwipe) return;

    this.tabSwipe.emit(horizontalDistance < 0 ? 1 : -1);
  }

  protected cancelSwipe(): void {
    this.startX = null;
    this.startY = null;
    this.pointerId = null;
  }

  private isInteractiveTarget(target: EventTarget | null): boolean {
    return (
      target instanceof Element &&
      target.closest(
        'a, button, input, select, textarea, [data-no-tab-swipe]'
      ) !== null
    );
  }
}
