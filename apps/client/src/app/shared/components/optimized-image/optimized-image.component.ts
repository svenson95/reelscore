import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'rs-optimized-image',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage],
  styles: `
    :host { @apply flex flex-col items-center; }
  `,
  template: `
    <img
      class="optimized-image"
      [ngSrc]="source()"
      [alt]="altText()"
      [width]="width()"
      [height]="height()"
      loading="lazy"
    />
  `,
})
export class OptimizedImageComponent {
  source = input.required<string>();
  altText = input.required<string>();

  width = input.required<string>();
  height = input.required<string>();
}
