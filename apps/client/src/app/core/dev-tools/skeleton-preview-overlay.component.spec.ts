import { TestBed } from '@angular/core/testing';

import { SkeletonPreviewOverlayComponent } from './skeleton-preview-overlay.component';
import { SkeletonPreviewService } from './skeleton-preview.service';

describe(SkeletonPreviewOverlayComponent.name, () => {
  it('toggles the preview state when the button is clicked', () => {
    const fixture = TestBed.createComponent(SkeletonPreviewOverlayComponent);
    const preview = TestBed.inject(SkeletonPreviewService);
    fixture.detectChanges();

    const button: HTMLButtonElement =
      fixture.nativeElement.querySelector('button');
    expect(button.getAttribute('aria-pressed')).toBe('false');

    button.click();
    fixture.detectChanges();

    expect(preview.showLoading()).toBe(true);
    expect(button.getAttribute('aria-pressed')).toBe('true');

    button.click();
    fixture.detectChanges();

    expect(preview.showLoading()).toBe(false);
    expect(button.getAttribute('aria-pressed')).toBe('false');
  });
});
