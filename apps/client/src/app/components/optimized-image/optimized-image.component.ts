import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'futbet-optimized-image',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage],
  styles: `:host { @apply self-center; }`,
  template: ` <img
    [ngSrc]="source()"
    [alt]="alternate"
    priority
    [width]="width()"
    [height]="height()"
  />`,
})
export class OptimizedImageComponent {
  source = input.required<string>();
  alternate = input.required<string>();

  width = input.required<string>();
  height = input.required<string>();
}
