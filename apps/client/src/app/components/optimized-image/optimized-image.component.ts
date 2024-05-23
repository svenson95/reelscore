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
    alt="Logo"
    priority
    width="16"
    height="12"
  />`,
})
export class OptimizedImageComponent {
  source = input.required<string>();
}
