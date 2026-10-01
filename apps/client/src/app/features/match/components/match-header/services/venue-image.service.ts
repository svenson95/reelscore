import {
  computed,
  DestroyRef,
  effect,
  inject,
  Injectable,
  signal,
} from '@angular/core';

export const ALLIANZ_ARENA_ID = 20732;

@Injectable()
export class VenueImageService {
  private readonly activeVenueImageUrl = signal<string | undefined>(undefined);
  private activeVenueObjectUrl?: string;

  private readonly venueId = signal<number | null>(null);
  readonly hasValidVenueBackground = signal<boolean>(false);
  readonly venueBackgroundLoaded = signal<boolean>(false);

  readonly venueBackgroundImage = computed(() => {
    const imageUrl = this.activeVenueImageUrl();

    if (!imageUrl || !this.hasValidVenueBackground()) {
      return undefined;
    }

    return `url("${imageUrl}")`;
  });

  private readonly venueImageLoader = effect((onCleanup) => {
    const abortController = new AbortController();

    onCleanup(() => {
      abortController.abort();
    });

    this.loadVenueImage(abortController.signal).catch(() => {
      if (!abortController.signal.aborted) {
        this.setVenueBackground(undefined, true);
      }
    });
  });

  constructor() {
    inject(DestroyRef).onDestroy(() => this.revokeActiveObjectUrl());
  }

  setVenueId(venueId: number | null): void {
    this.venueId.set(venueId);
  }

  private async loadVenueImage(abortSignal: AbortSignal): Promise<void> {
    const selectedVenueId = this.venueId();

    if (!selectedVenueId) {
      this.setVenueBackground(undefined, true);

      return;
    }

    this.setVenueBackground(undefined, false);

    const imageUrl = this.getVenueImageUrl(selectedVenueId);
    const validImageUrl = await this.getValidVenueImageUrl(
      imageUrl,
      abortSignal
    );

    if (abortSignal.aborted) {
      return;
    }

    this.setVenueBackground(validImageUrl, true);
  }

  private async getValidVenueImageUrl(
    imageUrl: string,
    abortSignal: AbortSignal
  ): Promise<string | undefined> {
    const objectUrl = await this.loadVenueImageAsObjectUrl(
      imageUrl,
      abortSignal
    );

    if (objectUrl) {
      return objectUrl;
    }

    if (abortSignal.aborted) {
      return undefined;
    }

    const fallbackImageUrl = this.getVenueImageUrl(ALLIANZ_ARENA_ID);

    return this.loadVenueImageAsObjectUrl(fallbackImageUrl, abortSignal);
  }

  private getVenueImageUrl(venueId: number): string {
    return `https://media.api-sports.io/football/venues/${venueId}.png`;
  }

  private async loadVenueImageAsObjectUrl(
    imageUrl: string,
    abortSignal: AbortSignal
  ): Promise<string | undefined> {
    let objectUrl: string | undefined;

    try {
      const response = await fetch(imageUrl, {
        signal: abortSignal,
        referrerPolicy: 'no-referrer',
      });

      if (!response.ok) {
        return undefined;
      }

      const imageBlob = await response.blob();

      if (abortSignal.aborted) {
        return undefined;
      }

      objectUrl = URL.createObjectURL(imageBlob);

      const isValidImage = await this.validateImageDimensions(
        objectUrl,
        abortSignal
      );

      if (!isValidImage || abortSignal.aborted) {
        URL.revokeObjectURL(objectUrl);

        return undefined;
      }

      return objectUrl;
    } catch {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }

      return undefined;
    }
  }

  private validateImageDimensions(
    imageUrl: string,
    abortSignal: AbortSignal
  ): Promise<boolean> {
    return new Promise((resolve) => {
      const venueImage = new Image();

      const finishValidation = (hasValidDimensions: boolean) => {
        venueImage.onload = null;
        venueImage.onerror = null;
        abortSignal.removeEventListener('abort', handleAbort);

        resolve(hasValidDimensions);
      };

      const handleAbort = () => finishValidation(false);

      if (abortSignal.aborted) {
        finishValidation(false);

        return;
      }

      abortSignal.addEventListener('abort', handleAbort, { once: true });

      venueImage.onload = () => {
        // The image provider uses small images as placeholders for unavailable venues.
        const hasValidDimensions =
          venueImage.naturalWidth > 200 && venueImage.naturalHeight > 200;

        finishValidation(hasValidDimensions);
      };

      venueImage.onerror = () => finishValidation(false);
      venueImage.src = imageUrl;
    });
  }

  private setVenueBackground(imageUrl?: string, isLoaded = true): void {
    this.revokeActiveObjectUrl();

    this.activeVenueImageUrl.set(imageUrl);
    this.hasValidVenueBackground.set(Boolean(imageUrl));
    this.venueBackgroundLoaded.set(isLoaded);

    if (imageUrl?.startsWith('blob:')) {
      this.activeVenueObjectUrl = imageUrl;
    }
  }

  private revokeActiveObjectUrl(): void {
    if (!this.activeVenueObjectUrl) {
      return;
    }

    URL.revokeObjectURL(this.activeVenueObjectUrl);
    this.activeVenueObjectUrl = undefined;
  }
}
