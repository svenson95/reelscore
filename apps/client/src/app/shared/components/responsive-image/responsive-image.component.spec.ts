import { TestBed } from '@angular/core/testing';

import { ResponsiveImageComponent } from './responsive-image.component';

describe('ResponsiveImageComponent', () => {
  it('shows the shield until the logo has loaded and restores it for the next logo', () => {
    const fixture = TestBed.createComponent(ResponsiveImageComponent);
    fixture.componentRef.setInput('source', '/assets/teams/first.png');
    fixture.componentRef.setInput('altText', 'Team logo');
    fixture.componentRef.setInput('width', 32);
    fixture.componentRef.setInput('height', 32);
    fixture.detectChanges();

    const image = fixture.nativeElement.querySelector(
      'img'
    ) as HTMLImageElement;

    expect(
      fixture.nativeElement.querySelector('.missing-image-placeholder')
    ).not.toBeNull();
    expect(
      fixture.nativeElement
        .querySelector('picture')
        .classList.contains('image-pending')
    ).toBe(true);

    image.dispatchEvent(new Event('load'));
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('.missing-image-placeholder')
    ).toBeNull();
    expect(
      fixture.nativeElement
        .querySelector('picture')
        .classList.contains('image-pending')
    ).toBe(false);

    fixture.componentRef.setInput('altText', 'Renamed team');
    fixture.detectChanges();

    expect(image.alt).toBe('Renamed team');
    expect(
      fixture.nativeElement.querySelector('.missing-image-placeholder')
    ).toBeNull();

    fixture.componentRef.setInput('source', '/assets/teams/second.png');
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('.missing-image-placeholder')
    ).not.toBeNull();

    image.dispatchEvent(new Event('load'));
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('.missing-image-placeholder')
    ).toBeNull();
  });

  it('shows a decorative shield without requesting an empty URL', () => {
    const fixture = TestBed.createComponent(ResponsiveImageComponent);
    fixture.componentRef.setInput('source', '');
    fixture.componentRef.setInput('altText', '');
    fixture.componentRef.setInput('width', 14);
    fixture.componentRef.setInput('height', 14);
    fixture.detectChanges();

    const placeholder = fixture.nativeElement.querySelector(
      '.missing-image-placeholder'
    );

    expect(fixture.nativeElement.querySelector('img')).toBeNull();
    expect(placeholder.getAttribute('aria-hidden')).toBe('true');
    expect(placeholder.hasAttribute('role')).toBe(false);
  });

  it.each(['sourceSet', 'darkSourceSet'])(
    'retries a failed logo when only %s changes',
    (inputName) => {
      const fixture = TestBed.createComponent(ResponsiveImageComponent);
      fixture.componentRef.setInput('source', '/assets/competitions/logo.png');
      fixture.componentRef.setInput('altText', 'Competition logo');
      fixture.componentRef.setInput('width', 24);
      fixture.componentRef.setInput('height', 24);
      fixture.detectChanges();

      fixture.nativeElement
        .querySelector('img')
        .dispatchEvent(new Event('error'));
      fixture.detectChanges();

      fixture.componentRef.setInput(
        inputName,
        '/assets/competitions/updated.png 2x'
      );
      fixture.detectChanges();

      const image = fixture.nativeElement.querySelector(
        'img'
      ) as HTMLImageElement;
      const source = fixture.nativeElement.querySelector(
        'source'
      ) as HTMLSourceElement | null;

      expect((source ?? image).getAttribute('srcset')).toBe(
        '/assets/competitions/updated.png 2x'
      );
      expect(
        fixture.nativeElement.querySelector('.missing-image-placeholder')
      ).not.toBeNull();

      image.dispatchEvent(new Event('load'));
      fixture.detectChanges();

      expect(
        fixture.nativeElement.querySelector('.missing-image-placeholder')
      ).toBeNull();
    }
  );

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
