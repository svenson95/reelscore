import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { SeoService } from './seo.service';

@Component({ template: '' })
class TestRouteComponent {}

describe('SeoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([{ path: 'seo-test', component: TestRouteComponent }]),
      ],
    });
  });

  afterEach(() => {
    document.querySelector('link[rel="canonical"]')?.remove();
    document.querySelector('meta[property="og:url"]')?.remove();
  });

  it('updates canonical and Open Graph URLs after navigation', async () => {
    TestBed.inject(SeoService).init();

    await TestBed.inject(Router).navigateByUrl('/seo-test?source=home');

    const expectedCanonicalUrl = new URL('/seo-test', document.baseURI).href;

    expect(
      document.querySelector('link[rel="canonical"]')?.getAttribute('href')
    ).toBe(expectedCanonicalUrl);
    expect(
      document.querySelector('meta[property="og:url"]')?.getAttribute('content')
    ).toBe(expectedCanonicalUrl);
  });

  it('updates the existing canonical link instead of creating another one', async () => {
    const existingCanonicalLink = document.createElement('link');
    existingCanonicalLink.rel = 'canonical';
    document.head.appendChild(existingCanonicalLink);

    TestBed.inject(SeoService).init();

    await TestBed.inject(Router).navigateByUrl('/seo-test');

    expect(document.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
    expect(document.querySelector('link[rel="canonical"]')).toBe(
      existingCanonicalLink
    );
    expect(existingCanonicalLink.href).toBe(
      new URL('/seo-test', document.baseURI).href
    );
  });
});
