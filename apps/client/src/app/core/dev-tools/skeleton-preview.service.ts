import { computed, Injectable, signal } from '@angular/core';

import { environment } from '@app/environment';

@Injectable({ providedIn: 'root' })
export class SkeletonPreviewService {
  readonly enabled =
    !environment.production &&
    'matchSkeletonPreview' in environment &&
    environment.matchSkeletonPreview === true;

  private readonly previewActive = signal<boolean>(false);

  readonly showLoading = computed<boolean>(
    () => this.enabled && this.previewActive()
  );

  toggle(): void {
    this.previewActive.update((previewActive) => !previewActive);
  }
}
