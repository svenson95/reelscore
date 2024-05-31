import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'futbet-optimized-image',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage],
  styles: `
    :host { @apply self-center; }
    .fill-parent { position: relative; }
    .fill-parent img { object-fit: contain; }
  `,
  template: `
    @if (fill()) {
    <div
      class="fill-parent"
      [style.height]="height() + 'px'"
      [style.width]="width() + 'px'"
    >
      <img [ngSrc]="source()" [alt]="alternate()" priority fill />
    </div>
    } @else {<img
      [ngSrc]="source()"
      [alt]="alternate()"
      priority
      [width]="width()"
      [height]="height()"
    />}
  `,
})
export class OptimizedImageComponent {
  source = input.required<string>();
  alternate = input.required<string>();

  width = input<string>();
  height = input<string>();

  fill = input<boolean>(false);
}
