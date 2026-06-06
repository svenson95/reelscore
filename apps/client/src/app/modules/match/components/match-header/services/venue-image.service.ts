import { computed, effect, Injectable, signal } from '@angular/core';

export const ALLIANZ_ARENA_ID = 20732;

@Injectable()
export class VenueImageService {
  private readonly activeVenueImageUrl = signal<string | undefined>(undefined);

  private readonly venueId = signal<number | null>(null);
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

  setVenueId(venueId: number | null): void {
    this.venueId.set(venueId);
  }

  private async loadVenueImage(isCancelled: () => boolean): Promise<void> {
    const id = this.venueId();

    if (!id) {
      this.setVenueBackground(undefined, true);
      return;
    }

    this.setVenueBackground(undefined, false);

    const imageUrl = this.getVenueImageUrl(id);
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
