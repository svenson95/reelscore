import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { ScrollService } from '../services';

@Component({
  selector: 'rs-collapsible-scroll-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  providers: [],
  styles: `
    :host {
      @apply flex flex-col gap-1;
    }

    .animation-wrapper {
      overflow: clip;
      contain: paint style;

      --highlights-height: 0px;
      --highlights-progress: 0;
      --manual-collapse: 0;

      height: calc(
        var(--highlights-height)
        * (1 - var(--highlights-progress))
        * (1 - var(--manual-collapse))
      );

      opacity: calc(
        (1 - var(--highlights-progress))
        * (1 - var(--manual-collapse))
      );

      transition: none;
      will-change: height, opacity;
    }

    .animation-wrapper--manual-animating {
      transition:
        height 220ms ease,
        opacity 160ms ease;
    }

    .animation-wrapper--manual-active {
      --manual-collapse: 1;
    }

    .toggle-highlights-row {
      @apply flex items-center py-rs1;

      .divider {
        @apply w-full h-[1px] bg-rs-border-color-2;
      }
    }

    .collapse-button {
      @apply inline-flex absolute bottom-[-5px] left-[50%] translate-x-[-50%] justify-center items-center border-none;

      width: 2rem;
      height: 2rem;
      color: var(--rs-color-text-2);

      transition:
        opacity 160ms ease,
        background-color 160ms ease;
    }

    .toggle-icon {
      transition: transform 220ms ease;
    }

    .collapse-button--active .toggle-icon {
      transform: rotate(180deg);
    }
  `,
  template: `
    <div
      #animationWrapper
      class="animation-wrapper"
      [class.animation-wrapper--manual-active]="collapsed()"
      [class.animation-wrapper--manual-animating]="manualAnimating()"
    >
      <ng-content />
    </div>

    <button
      type="button"
      class="collapse-button"
      [class.opacity-0]="!hasVisibleHeight()"
      [class.collapse-button--active]="collapsed()"
      [attr.aria-expanded]="!collapsed()"
      aria-label="Highlights ein- oder ausklappen"
      (click)="toggle()"
    >
      <svg
        class="toggle-icon"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          d="M6 15l6-6 6 6"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
  `,
})
export class CollapsibleScrollSection {
  private readonly scrollService = inject(ScrollService);

  @ViewChild('animationWrapper', { read: ElementRef })
  set animationWrapper(ref: ElementRef<HTMLElement> | null) {
    this.scrollService.setAnimationWrapper(ref);
  }

  readonly collapsed = signal<boolean>(false);
  readonly manualAnimating = signal<boolean>(false);

  readonly hasVisibleHeight = this.scrollService.hasVisibleHeight;

  toggle(): void {
    this.manualAnimating.set(true);
    this.collapsed.update((value) => !value);

    window.setTimeout(() => {
      this.manualAnimating.set(false);
    }, 230);
  }
}
