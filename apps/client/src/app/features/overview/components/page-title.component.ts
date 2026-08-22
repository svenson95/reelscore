import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'rs-page-title',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      @apply flex min-h-10 w-full items-center gap-3 px-3;
    }

    .title-wrapper {
      @apply flex shrink-0 items-center gap-3;
    }

    .marker {
      @apply flex shrink-0 gap-1;
      transform: skewX(-16deg);
    }

    .marker::before,
    .marker::after {
      content: '';
      @apply block w-1.5 bg-rs-color-primary;
    }

    .marker::before {
      @apply h-6;
    }

    .marker::after {
      @apply h-6;
      opacity: 0.55;
    }

    h2 {
      @apply m-0 font-bold uppercase italic tracking-wide text-rs-color-text-1;
      line-height: 1;
    }

    .divider {
      @apply h-px min-w-4 flex-1;
      background-color: var(--rs-border-color-2);
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

    <div class="action">
      <ng-content select="[pageTitleAction]" />
    </div>
  `,
})
export class PageTitleComponent {
  readonly title = input.required<string>();
}
