import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  input,
} from '@angular/core';

import { Directive } from '@angular/core';

@Directive({
  selector: '[rsPageTitleAction]',
  standalone: true,
})
export class PageTitleActionDirective {}

@Component({
  selector: 'rs-page-title',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      @apply flex min-h-10 w-full items-center gap-3 pl-3 pr-2;
    }

    .title-wrapper {
      @apply flex shrink-0 items-center gap-[0.1rem];
    }

    .marker {
      @apply flex shrink-0 gap-[0.2rem];
      transform: skewX(-16deg);
    }

    .marker::before,
    .marker::after {
      content: '';
      @apply block w-[2px] bg-rs-color-primary;
    }

    .marker::before {
      @apply h-[12px] opacity-[0.6];
    }

    .marker::after {
      @apply h-[12px];
    }

    h2 {
      @apply m-0 font-medium uppercase italic tracking-wide text-rs-color-text-1 leading-none;
    }

    .divider {
      @apply h-px min-w-4 flex-1 bg-rs-border-color-2;
    }

    .action {
      @apply flex shrink-0 items-center;
    }
  `,
  template: `
    <div class="title-wrapper">
      <span class="marker" aria-hidden="true"></span>
      <h2>{{ title() }}</h2>
    </div>

    <span class="divider" aria-hidden="true"></span>

    @if (action()) {
    <div class="action">
      <ng-content select="[rsPageTitleAction]" />
    </div>
    }
  `,
})
export class PageTitleComponent {
  readonly title = input.required<string>();

  protected readonly action = contentChild(PageTitleActionDirective);
}
