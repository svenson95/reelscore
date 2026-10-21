import { TestBed } from '@angular/core/testing';

import { ResponsiveImageComponent } from './responsive-image.component';

describe('ResponsiveImageComponent', () => {
  it('shows a fallback image when the requested asset is unavailable', () => {
    const fixture = TestBed.createComponent(ResponsiveImageComponent);
    fixture.componentRef.setInput('source', '/assets/teams/missing.png');
    fixture.componentRef.setInput('sourceSet', '/assets/teams/missing.png 1x');
    fixture.componentRef.setInput('altText', 'Team logo');
    fixture.componentRef.setInput('width', 32);
    fixture.componentRef.setInput('height', 32);
    fixture.detectChanges();

    const image = fixture.nativeElement.querySelector(
      'img'
    ) as HTMLImageElement;
    image.dispatchEvent(new Event('error'));
    fixture.detectChanges();

    const placeholder = fixture.nativeElement.querySelector(
      '.missing-image-placeholder'
    ) as HTMLSpanElement;

    expect(fixture.nativeElement.querySelector('img')).toBeNull();
    expect(placeholder.getAttribute('role')).toBe('img');
    expect(placeholder.getAttribute('aria-label')).toBe('Team logo');
    expect(placeholder.style.width).toBe('32px');
    expect(placeholder.style.height).toBe('32px');
  });

  it('supports eager loading for above-the-fold images', () => {
    const fixture = TestBed.createComponent(ResponsiveImageComponent);
    fixture.componentRef.setInput('source', '/assets/teams/available.png');
    fixture.componentRef.setInput('altText', 'Team logo');
    fixture.componentRef.setInput('width', 48);
    fixture.componentRef.setInput('height', 48);
    fixture.componentRef.setInput('loading', 'eager');
    fixture.detectChanges();

    const image = fixture.nativeElement.querySelector(
      'img'
    ) as HTMLImageElement;

    expect(image.getAttribute('loading')).toBe('eager');
  });

  it('retries the image when the source changes after a failed load', () => {
    const fixture = TestBed.createComponent(ResponsiveImageComponent);
    fixture.componentRef.setInput('source', '/assets/teams/missing.png');
    fixture.componentRef.setInput('altText', 'Team logo');
    fixture.componentRef.setInput('width', 32);
    fixture.componentRef.setInput('height', 32);
    fixture.detectChanges();

    const image = fixture.nativeElement.querySelector(
      'img'
    ) as HTMLImageElement;
    image.dispatchEvent(new Event('error'));
    fixture.detectChanges();

    fixture.componentRef.setInput('source', '/assets/teams/available.png');
    fixture.detectChanges();

    const retriedImage = fixture.nativeElement.querySelector(
      'img'
    ) as HTMLImageElement;

    expect(retriedImage.getAttribute('src')).toBe(
      '/assets/teams/available.png'
    );
  });
});
