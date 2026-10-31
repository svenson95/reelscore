import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  effect,
  input,
  model,
  signal,
} from '@angular/core';

import {
  TabPanelDirective,
  type TabSwipeDirection,
  TabSwipeDirective,
} from '../directives';

import type { TabNavigationItem } from './tab-navigation.component';

@Component({
  selector: 'rs-tab-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, TabSwipeDirective],
  styles: `
    :host {
      display: block;
      min-width: 0;
    }
    .tab-content-transition {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      overflow-x: clip;
      touch-action: pan-y;
    }

    .tab-panel {
      grid-area: 1 / 1;
      @apply flex flex-col gap-2;
    }

    .slide-in {
      z-index: 1;
      animation: tab-slide-in 250ms cubic-bezier(0.4, 0, 0.2, 1) both;
    }

    .slide-out {
      z-index: 0;
      animation: tab-slide-out 250ms cubic-bezier(0.4, 0, 0.2, 1) both;
    }

    @keyframes tab-slide-in {
      from {
        transform: translateX(var(--tab-slide-in-offset));
      }

      to {
        transform: translateX(0);
      }
    }

    @keyframes tab-slide-out {
      from {
        transform: translateX(0);
      }

      to {
        transform: translateX(var(--tab-slide-out-offset));
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .slide-in,
      .slide-out {
        animation-duration: 1ms;
      }
    }
  `,
  template: `
    <div
      class="tab-content-transition"
      rsTabSwipe
      [style.--tab-slide-in-offset]="slideInOffset()"
      [style.--tab-slide-out-offset]="slideOutOffset()"
      (tabSwipe)="navigateBySwipe($event)"
    >
      @for (panel of panels(); track panel; let index = $index) { @if
      (visitedTabs().has(index)) {
      <div
        class="tab-panel"
        [class.slide-in]="hasNavigated() && selectedIndex() === index"
        [class.slide-out]="leavingTabIndex() === index"
        [style.display]="isTabVisible(index) ? null : 'none'"
        (animationend)="finishPanelAnimation($event, index)"
      >
        <ng-container [ngTemplateOutlet]="panel.template" />
      </div>
      } }
    </div>
  `,
})
export class TabViewComponent {
  readonly tabs = input.required<readonly TabNavigationItem[]>();
  readonly selectedIndex = model.required<number>();
  protected readonly panels = contentChildren(TabPanelDirective);
  protected readonly visitedTabs = signal<ReadonlySet<number>>(new Set([0]));
  protected readonly hasNavigated = signal(false);
  protected readonly leavingTabIndex = signal<number | null>(null);

  private readonly navigationDirection = signal<'forward' | 'backward'>(
    'forward'
  );

  protected readonly slideInOffset = computed(() =>
    this.navigationDirection() === 'forward' ? '100%' : '-100%'
  );
  protected readonly slideOutOffset = computed(() =>
    this.navigationDirection() === 'forward' ? '-100%' : '100%'
  );

  private selectTab(index: number): void {
    if (!this.tabs()[index] || this.tabs()[index].disabled) return;

    this.selectedIndex.set(index);
  }

  protected navigateBySwipe(direction: TabSwipeDirection): void {
    const nextIndex = this.selectedIndex() + direction;
    if (nextIndex < 0 || nextIndex >= this.tabs().length) return;

    this.selectTab(nextIndex);
  }

  protected isTabVisible(index: number): boolean {
    return this.selectedIndex() === index || this.leavingTabIndex() === index;
  }

  protected finishPanelAnimation(
    event: AnimationEvent,
    tabIndex: number
  ): void {
    if (
      event.target === event.currentTarget &&
      this.leavingTabIndex() === tabIndex
    ) {
      this.leavingTabIndex.set(null);
    }
  }

  private previousIndex = 0;

  private readonly selectionEffect = effect(() => {
    const index = this.selectedIndex();
    if (this.tabs()[index]?.disabled) {
      this.selectedIndex.set(0);
      this.previousIndex = 0;
      this.leavingTabIndex.set(null);
      return;
    }

    if (index === this.previousIndex) return;

    this.leavingTabIndex.set(this.previousIndex);
    this.hasNavigated.set(true);
    this.navigationDirection.set(
      index > this.previousIndex ? 'forward' : 'backward'
    );
    this.visitedTabs.update((visited) => new Set(visited).add(index));
    this.previousIndex = index;
  });
}
