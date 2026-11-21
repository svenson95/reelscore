import type { OnChanges, SimpleChanges } from '@angular/core';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';

@Component({
  selector: 'rs-responsive-image',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host { @apply grid place-items-center; }
    picture, .missing-image-placeholder { grid-area: 1 / 1; max-width: 100%; max-height: 100%; }
    .responsive-image { @apply block max-w-full max-h-full object-contain; }
    .image-pending { visibility: hidden; }
    .missing-image-placeholder {
      @apply block bg-gray-400;
      clip-path: polygon(50% 0, 100% 20%, 90% 70%, 50% 100%, 10% 70%, 0 20%);
    }
  `,
  template: `
    @if (!imageLoaded()) {
    <span
      class="missing-image-placeholder"
      [attr.role]="altText() ? 'img' : null"
      [attr.aria-hidden]="altText() ? null : 'true'"
      [attr.aria-label]="altText()"
      [style.width.px]="width()"
      [style.height.px]="height()"
    ></span>
    } @if (source() && !imageFailed()) {
    <picture [class.image-pending]="!imageLoaded()">
      @if (darkSourceSet()) {
      <source
        media="(prefers-color-scheme: dark)"
        [attr.srcset]="darkSourceSet()"
      />
      }
      <img
        class="responsive-image"
        [attr.loading]="loading()"
        decoding="async"
        [alt]="altText()"
        [width]="width()"
        [height]="height()"
        [attr.srcset]="sourceSet() || null"
        [src]="source()"
        (load)="imageLoaded.set(true)"
        (error)="imageLoaded.set(false); imageFailed.set(true)"
      />
    </picture>
    }
  `,
})
export class ResponsiveImageComponent implements OnChanges {
  readonly source = input.required<string>();
  readonly sourceSet = input<string>();
  readonly darkSourceSet = input<string>();
  readonly altText = input.required<string>();
  readonly width = input.required<number>();
  readonly height = input.required<number>();
  readonly loading = input<'eager' | 'lazy'>('lazy');

  protected readonly imageLoaded = signal(false);
  protected readonly imageFailed = signal(false);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['source'] || changes['sourceSet'] || changes['darkSourceSet']) {
      this.imageLoaded.set(false);
      this.imageFailed.set(false);
    }
  }
}
