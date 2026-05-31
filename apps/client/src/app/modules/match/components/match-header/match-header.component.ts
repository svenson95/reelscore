import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  HostListener,
  input,
  OnDestroy,
  signal,
  ViewChild,
} from '@angular/core';

import type { FixtureDTO, FixtureHighlights } from '@lib/models';

import { MatchHighlightsComponent, MatchInfoComponent } from './components';
import { VENUE_IDS } from './venue-ids.data';

const ALLIANZ_ARENA_ID = 20732;

@Component({
  selector: 'section[rs-match-header]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatchInfoComponent, MatchHighlightsComponent],
  styles: `
    :host {
      @apply px-3 sticky top-0 z-10;
      margin-top: -1.25rem;
      text-shadow: 0 0 4px var(--rs-color-text-3);
    }

    .wrapper {
      @apply flex flex-col mx-auto p-5 rounded-fb w-full max-w-rs-max-width shadow-rs2 bg-rs-alt-bg;
      border: 1px solid var(--rs-button-border-color);
    }

    .toggle-highlights-row {
      .divider {
        @apply w-full h-[1px];
        background-color: var(--rs-button-border-color);
        opacity: var(--highlights-opacity);
        margin-block: var(--divider-margin);
      }
    }

    .animation-wrapper {
      height: var(--animation-wrapper-height);
      opacity: var(--highlights-opacity);
      overflow: hidden;
      will-change: height, opacity;
    }

    .wrapper {
      position: relative;
      & > *:not(.background-wrapper) { z-index: 3; }
    }
    .background-wrapper {
      @apply bg-[0_70%] opacity-0 z-[1] bg-no-repeat bg-cover w-full h-full;

      position: absolute;
      top: 0;
      left: 0;
      transition: opacity 150ms ease-in-out;

      &--loaded {
        opacity: 0.2;
      }
    }
  `,
  template: `
    <div class="wrapper">
      <div
        class="background-wrapper"
        [class.background-wrapper--loaded]="
          venueBackgroundLoaded() && hasValidVenueBackground()
        "
        [style.background-image]="venueBackgroundImage()"
      ></div>
      <rs-match-info [data]="data()" />
      @if (highlights() && hasGoalsOrPenalty()) {
      <div
        class="toggle-highlights-row"
        [style.--highlights-opacity]="highlightsOpacity()"
        [style.--divider-margin]="dividerMargin()"
      >
        <div class="divider"></div>
      </div>

      <div
        class="animation-wrapper"
        [style.--animation-wrapper-height]="animationWrapperHeight()"
        [style.--highlights-opacity]="highlightsOpacity()"
      >
        @if (data(); as data) {
        <rs-match-highlights
          #matchHighlightsElement
          class="match-highlights"
          [data]="data"
          [highlights]="highlights()!"
        />
        }
      </div>
      }
    </div>
  `,
})
export class MatchHeaderComponent implements OnDestroy {
  readonly data = input.required<FixtureDTO | undefined>();
  readonly highlights = input.required<FixtureHighlights | undefined>();

  private resizeObserver?: ResizeObserver;

  private readonly scrollY = signal<number>(0);
  private readonly highlightsHeight = signal<number>(0);

  readonly highlightsOpacity = computed<string>(() => {
    const height = this.highlightsHeight();

    if (height === 0) {
      return '0';
    }

    const visibleHeight = Math.max(0, height - this.scrollY());
    const opacity = visibleHeight / height;

    return `${opacity}`;
  });

  readonly dividerMargin = computed<string>(() => {
    const height = this.highlightsHeight();

    if (height === 0) {
      return '0rem';
    }

    const visibleHeight = Math.max(0, height - this.scrollY());
    const visibleRatio = visibleHeight / height;

    return `${0.5 * visibleRatio}rem`;
  });

  readonly animationWrapperHeight = computed<string>(() => {
    const height = this.highlightsHeight() - this.scrollY();

    return `${Math.max(0, Math.round(height))}px`;
  });

  @ViewChild('matchHighlightsElement', { read: ElementRef })
  set matchHighlightsElement(ref: ElementRef<HTMLElement> | undefined) {
    this.resizeObserver?.disconnect();

    if (!ref) {
      this.highlightsHeight.set(0);
      return;
    }

    this.highlightsHeight.set(ref.nativeElement.scrollHeight);

    this.resizeObserver = new ResizeObserver(() => {
      this.highlightsHeight.set(ref.nativeElement.scrollHeight);
    });

    this.resizeObserver.observe(ref.nativeElement);
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.scrollY.set(window.scrollY);
  }

  private activeVenueImageUrl = signal<string | undefined>(undefined);
  readonly hasValidVenueBackground = signal<boolean>(false);
  readonly venueBackgroundLoaded = signal<boolean>(false);

  readonly venueImageUrl = computed(() => {
    const fixture = this.data();
    if (!fixture) return undefined;

    const venueId = VENUE_IDS[fixture.teams.home.id] ?? ALLIANZ_ARENA_ID;

    return `https://media.api-sports.io/football/venues/${venueId}.png`;
  });

  readonly venueBackgroundImage = computed(() => {
    const imageUrl = this.activeVenueImageUrl();

    if (!imageUrl || !this.hasValidVenueBackground()) return undefined;

    return `url("${imageUrl}")`;
  });

  readonly hasGoalsOrPenalty = computed<boolean>(() => {
    const data = this.data();
    if (!data) return false;

    const { goals, score } = data;

    const hasRegularGoals =
      goals.home !== null &&
      goals.away !== null &&
      (goals.home > 0 || goals.away > 0);

    const hasPenaltyGoals =
      score.penalty.home !== null &&
      score.penalty.away !== null &&
      (score.penalty.home > 0 || score.penalty.away > 0);

    return hasRegularGoals || hasPenaltyGoals;
  });

  readonly venueImageLoader = effect((onCleanup) => {
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

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  private async loadVenueImage(isCancelled: () => boolean): Promise<void> {
    this.setVenueBackground(undefined, false);

    const imageUrl = this.venueImageUrl();
    if (!imageUrl) return;

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
