import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { SkeletonPreviewService } from './skeleton-preview.service';

@Component({
  selector: 'rs-skeleton-preview-overlay',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .skeleton-dev-overlay {
      @apply fixed bottom-4 right-4 z-[1000] flex items-center gap-3 rounded-lg bg-gray-900 px-4 py-3 text-sm text-white shadow-xl;
    }

    .skeleton-dev-overlay button {
      @apply rounded bg-white px-3 py-1.5 font-semibold text-gray-900;
    }
  `,
  template: `
    <aside class="skeleton-dev-overlay" aria-label="Skeleton Vorschau">
      <span>Skeletons</span>
      <button
        type="button"
        [attr.aria-pressed]="isLoading()"
        (click)="toggle()"
      >
        {{ isLoading() ? 'Ausblenden' : 'Anzeigen' }}
      </button>
    </aside>
  `,
})
export class SkeletonPreviewOverlayComponent {
  private readonly preview = inject(SkeletonPreviewService);

  protected readonly isLoading = this.preview.showLoading;

  protected toggle(): void {
    this.preview.toggle();
  }
}
