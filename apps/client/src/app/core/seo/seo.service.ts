import { DOCUMENT } from '@angular/common';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Meta } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';

import { filter } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly meta = inject(Meta);
  private readonly router = inject(Router);

  init(): void {
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.updateCanonicalUrl());
  }

  private updateCanonicalUrl(): void {
    const path = this.router.url.split(/[?#]/, 1)[0];
    const canonicalUrl = new URL(path, this.document.baseURI).href;
    const canonicalLink =
      this.document.querySelector<HTMLLinkElement>('link[rel="canonical"]') ??
      this.document.head.appendChild(this.document.createElement('link'));

    canonicalLink.rel = 'canonical';
    canonicalLink.href = canonicalUrl;
    this.meta.updateTag({ property: 'og:url', content: canonicalUrl });
  }
}
