import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'reelscore-optimized-image',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage],
  styles: `
    :host { @apply flex items-center justify-center shrink-0; }
  `,
  template: `
    <img
      [ngSrc]="source()"
      [alt]="alternate()"
      [width]="width()"
      [height]="height()"
      loading="lazy"
    />
  `,
})
export class OptimizedImageComponent {
  source = input.required<string>();
  alternate = input.required<string>();

  width = input<string>();
  height = input<string>();
}
