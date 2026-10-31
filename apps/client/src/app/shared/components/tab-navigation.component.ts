import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  type ElementRef,
  input,
  output,
  signal,
  viewChildren,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

export interface TabNavigationItem {
  label: string;
  icon: string;
  disabled?: boolean;
}

@Component({
  selector: 'rs-tab-navigation',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  host: { '(window:resize)': 'updateIndicatorPosition()' },
  styles: `
    :host {
      @apply block mx-3;
    }

    .tab-navigation {
      position: relative;
      width: 100%;

      @apply flex justify-between overflow-x-auto px-4;
    }

    .active-indicator {
      position: absolute;
      bottom: 0;
      left: 0;
      width: var(--indicator-width, 0px);
      height: 2px;
      background: var(--rs-color-primary);
      transform: translateX(var(--indicator-left, 0px));
      transition:
        transform 250ms cubic-bezier(0.4, 0, 0.2, 1),
        width 250ms cubic-bezier(0.4, 0, 0.2, 1);
      pointer-events: none;
    }

    button {
      position: relative;
      flex: 0 0 auto;
      min-width: 36px;
      min-height: 40px;
      white-space: nowrap;

      @apply flex items-center justify-center gap-2 border-0 bg-transparent px-2 py-2 text-sm font-medium;

      color: var(--rs-color-text-2);
      cursor: pointer;
      transition: color 120ms ease;
    }

    button[aria-pressed='true'] {
      color: var(--rs-color-text-1);
      font-weight: 600;
    }

    button:disabled {
      color: var(--rs-border-color-2);
      cursor: default;
    }

    button:focus-visible {
      outline: 2px solid var(--rs-color-primary);
      outline-offset: -2px;
    }

    mat-icon {
      color: inherit;
    }

    .tab-label {
      display: none;
    }

    @media (min-width: 40rem) {
      .tab-label {
        display: inline;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .active-indicator {
        transition-duration: 1ms;
      }
    }
  `,
  template: `
    <div
      class="tab-navigation"
      role="group"
      [attr.aria-label]="ariaLabel()"
      [style.--indicator-left.px]="indicatorLeft()"
      [style.--indicator-width.px]="indicatorWidth()"
    >
      @for (tab of tabs(); track tab.label; let index = $index) {
      <button
        #tabButton
        type="button"
        [attr.aria-label]="tab.label"
        [attr.aria-pressed]="selectedIndex() === index"
        [disabled]="tab.disabled ?? false"
        (click)="selectTab(index)"
      >
        <mat-icon aria-hidden="true">{{ tab.icon }}</mat-icon>
        <span class="tab-label">{{ tab.label }}</span>
      </button>
      }

      <span class="active-indicator" aria-hidden="true"></span>
    </div>
  `,
})
export class TabNavigationComponent {
  readonly ariaLabel = input.required<string>();
  readonly tabs = input.required<readonly TabNavigationItem[]>();
  readonly selectedIndex = input.required<number>();

  readonly selectedIndexChange = output<number>();

  private readonly tabButtons =
    viewChildren<ElementRef<HTMLButtonElement>>('tabButton');

  protected readonly indicatorLeft = signal(0);
  protected readonly indicatorWidth = signal(0);

  private readonly indicatorPositionEffect = afterRenderEffect(() => {
    this.tabs();
    this.updateIndicatorPosition();
  });

  protected updateIndicatorPosition(): void {
    const activeButton = this.tabButtons()[this.selectedIndex()]?.nativeElement;

    if (!activeButton) {
      this.indicatorWidth.set(0);
      return;
    }

    this.indicatorLeft.set(activeButton.offsetLeft);
    this.indicatorWidth.set(activeButton.offsetWidth);
  }

  protected selectTab(index: number): void {
    if (index === this.selectedIndex()) return;

    this.selectedIndexChange.emit(index);
  }
}
