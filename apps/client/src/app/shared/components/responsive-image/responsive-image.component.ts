import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';

@Component({
  selector: 'rs-responsive-image',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host { @apply flex flex-col items-center; }
    .missing-image-placeholder {
      @apply block bg-gray-400;
      clip-path: polygon(50% 0, 100% 20%, 90% 70%, 50% 100%, 10% 70%, 0 20%);
    }
  `,
  template: `
    @if (imageFailed()) {
    <span
      class="missing-image-placeholder"
      role="img"
      [attr.aria-label]="altText()"
      [style.width.px]="width()"
      [style.height.px]="height()"
    ></span>
    } @else {
    <img
      class="responsive-image"
      [attr.loading]="loading()"
      decoding="async"
      [alt]="altText()"
      [width]="width()"
      [height]="height()"
      [attr.srcset]="sourceSet() || null"
      [src]="source()"
      (error)="handleImageError()"
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
  readonly loading = input<'eager' | 'lazy'>('lazy');

  private readonly failedSource = signal<string | null>(null);

  protected readonly imageFailed = computed<boolean>(
    () => this.failedSource() === this.source()
  );

  protected handleImageError(): void {
    this.failedSource.set(this.source());
  }
}
