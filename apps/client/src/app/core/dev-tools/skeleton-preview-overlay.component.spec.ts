import { TestBed } from '@angular/core/testing';

import { environment } from '@app/environment';

import { SkeletonPreviewService } from './skeleton-preview.service';
import { SkeletonPreviewOverlayComponent } from './skeleton-preview-overlay.component';

describe(SkeletonPreviewOverlayComponent.name, () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('toggles the preview state when the button is clicked', () => {
    jest.replaceProperty(environment, 'matchSkeletonPreview', true);

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
