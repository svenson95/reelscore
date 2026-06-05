import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'rs-responsive-image',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host { @apply flex flex-col items-center; }
  `,
  template: `
    @if (sourceSet(); as set) {
    <img
      class="responsive-image"
      [src]="source()"
      [srcset]="set"
      [alt]="altText()"
      [width]="width()"
      [height]="height()"
      loading="lazy"
      fetchpriority="high"
      decoding="async"
    />
    } @else {
    <img
      class="responsive-image"
      [src]="source()"
      [alt]="altText()"
      [width]="width()"
      [height]="height()"
      loading="lazy"
      fetchpriority="high"
      decoding="async"
    />
    }
  `,
})
export class ResponsiveImageComponent {
  readonly source = input.required<string>();
  readonly sourceSet = input<string>();
  readonly altText = input.required<string>();
  readonly width = input.required<number>();
  readonly height = input.required<number>();
}
