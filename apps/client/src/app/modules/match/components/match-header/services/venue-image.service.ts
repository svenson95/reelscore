import { computed, effect, Injectable, signal } from '@angular/core';

import type { FixtureDTO } from '@lib/models';

import { VENUE_IDS } from '../venue-ids.data';

const ALLIANZ_ARENA_ID = 20732;

@Injectable()
export class VenueImageService {
  private readonly activeVenueImageUrl = signal<string | undefined>(undefined);
  private readonly data = signal<FixtureDTO | undefined>(undefined);

  readonly hasValidVenueBackground = signal<boolean>(false);
  readonly venueBackgroundLoaded = signal<boolean>(false);

  readonly venueBackgroundImage = computed(() => {
    const imageUrl = this.activeVenueImageUrl();

    if (!imageUrl || !this.hasValidVenueBackground()) return undefined;

    return `url("${imageUrl}")`;
  });

  venueImageLoader = effect((onCleanup) => {
    let cancelled = false;

    onCleanup(() => {
      cancelled = true;
    });

    this.loadVenueImage(() => cancelled).catch(() => {
      if (!cancelled) {
        this.setVenueBackground(undefined, true);
      }
    });
  });

  setData(fixture: FixtureDTO | undefined): void {
    this.data.set(fixture);
  }

  private async loadVenueImage(isCancelled: () => boolean): Promise<void> {
    this.setVenueBackground(undefined, false);

    const fixture = this.data();
    const venueId = fixture
      ? VENUE_IDS[fixture.teams.home.id]
      : ALLIANZ_ARENA_ID;
    const imageUrl = this.getVenueImageUrl(venueId);
    const validImageUrl = await this.getValidVenueImageUrl(imageUrl);

    if (isCancelled()) return;

    this.setVenueBackground(validImageUrl, true);
  }

  private async getValidVenueImageUrl(
    imageUrl: string
  ): Promise<string | undefined> {
    if (await this.preloadVenueImage(imageUrl)) {
      return imageUrl;
    }

    const fallbackImageUrl = this.getVenueImageUrl(ALLIANZ_ARENA_ID);

    if (await this.preloadVenueImage(fallbackImageUrl)) {
      return fallbackImageUrl;
    }

    return undefined;
  }

  private getVenueImageUrl(venueId: number): string {
    return `https://media.api-sports.io/football/venues/${venueId}.png`;
  }

  private preloadVenueImage(imageUrl: string): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();

      img.onload = () => {
        const isPlaceholder =
          img.naturalWidth <= 200 || img.naturalHeight <= 200;

        resolve(!isPlaceholder);
      };

      img.onerror = () => {
        resolve(false);
      };

      img.src = imageUrl;
    });
  }

  private setVenueBackground(imageUrl?: string, loaded = true): void {
    this.activeVenueImageUrl.set(imageUrl);
    this.hasValidVenueBackground.set(Boolean(imageUrl));
    this.venueBackgroundLoaded.set(loaded);
  }
}
