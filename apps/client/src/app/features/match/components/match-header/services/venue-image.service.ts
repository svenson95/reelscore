import { computed, effect, Injectable, signal } from '@angular/core';

export const ALLIANZ_ARENA_ID = 20732;

@Injectable()
export class VenueImageService {
  private readonly activeVenueImageUrl = signal<string | undefined>(undefined);
  private activeObjectUrl?: string;

  private readonly venueId = signal<number | null>(null);
  readonly hasValidVenueBackground = signal<boolean>(false);
  readonly venueBackgroundLoaded = signal<boolean>(false);

  readonly venueBackgroundImage = computed(() => {
    const imageUrl = this.activeVenueImageUrl();

    if (!imageUrl || !this.hasValidVenueBackground()) return undefined;

    return `url("${imageUrl}")`;
  });

  venueImageLoader = effect((onCleanup) => {
    const controller = new AbortController();

    onCleanup(() => {
      controller.abort();
    });

    this.loadVenueImage(controller.signal).catch(() => {
      if (!controller.signal.aborted) {
        this.setVenueBackground(undefined, true);
      }
    });
  });

  setVenueId(venueId: number | null): void {
    this.venueId.set(venueId);
  }

  private async loadVenueImage(signal: AbortSignal): Promise<void> {
    const id = this.venueId();

    if (!id) {
      this.setVenueBackground(undefined, true);
      return;
    }

    this.setVenueBackground(undefined, false);

    const imageUrl = this.getVenueImageUrl(id);
    const validImageUrl = await this.getValidVenueImageUrl(imageUrl, signal);

    if (signal.aborted) return;

    this.setVenueBackground(validImageUrl, true);
  }

  private async getValidVenueImageUrl(
    imageUrl: string,
    signal: AbortSignal
  ): Promise<string | undefined> {
    const objectUrl = await this.loadVenueImageAsObjectUrl(imageUrl, signal);

    if (objectUrl) {
      return objectUrl;
    }

    const fallbackImageUrl = this.getVenueImageUrl(ALLIANZ_ARENA_ID);
    return this.loadVenueImageAsObjectUrl(fallbackImageUrl, signal);
  }

  private getVenueImageUrl(venueId: number): string {
    return `https://media.api-sports.io/football/venues/${venueId}.png`;
  }

  private async loadVenueImageAsObjectUrl(
    imageUrl: string,
    signal: AbortSignal
  ): Promise<string | undefined> {
    try {
      const response = await fetch(imageUrl, {
        signal,
        referrerPolicy: 'no-referrer',
      });

      if (!response.ok) {
        return undefined;
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);

      const isValidImage = await this.validateImageDimensions(objectUrl);

      if (!isValidImage) {
        URL.revokeObjectURL(objectUrl);
        return undefined;
      }

      return objectUrl;
    } catch {
      return undefined;
    }
  }

  private validateImageDimensions(imageUrl: string): Promise<boolean> {
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
    this.revokeActiveObjectUrl();

    this.activeVenueImageUrl.set(imageUrl);
    this.hasValidVenueBackground.set(Boolean(imageUrl));
    this.venueBackgroundLoaded.set(loaded);

    if (imageUrl?.startsWith('blob:')) {
      this.activeObjectUrl = imageUrl;
    }
  }

  private revokeActiveObjectUrl(): void {
    if (!this.activeObjectUrl) return;

    URL.revokeObjectURL(this.activeObjectUrl);
    this.activeObjectUrl = undefined;
  }
}
