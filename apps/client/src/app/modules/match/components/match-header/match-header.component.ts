import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  HostListener,
  inject,
  input,
  OnDestroy,
  signal,
  ViewChild,
} from '@angular/core';

import type { FixtureDTO, FixtureHighlights } from '@lib/models';

import { MatchHighlightsComponent, MatchInfoComponent } from './components';
import { ScrollService } from './services';
import { VENUE_IDS } from './venue-ids.data';

const ALLIANZ_ARENA_ID = 20732;

@Component({
  selector: 'section[rs-match-header]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatchInfoComponent, MatchHighlightsComponent],
  providers: [ScrollService],
  styles: `
    :host {
      @apply px-3;
      margin-top: -1.25rem;
      text-shadow: 0 0 4px var(--rs-color-text-3);
    }

    .wrapper {
      @apply flex flex-col mx-auto p-5 rounded-fb w-full max-w-rs-max-width shadow-rs2 bg-rs-alt-bg border;
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

    .animation-wrapper {
      overflow: hidden;
      will-change: height;
    }

    .animation-content {
      will-change: transform, opacity;
      transform: translate3d(0, 0, 0);
    }

    .toggle-highlights-row {
      @apply flex items-center py-rs1;
      overflow: hidden;
      will-change: height, opacity;

      .divider {
        @apply w-full h-[1px] bg-rs-border-color-2;
      }
    }

    .match-highlights {
      display: block;
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
      @let matchInfo = data();
      <rs-match-info [data]="matchInfo" />
      @if (highlights() && hasGoalsOrPenalty() && matchInfo) {
      <div
        class="animation-wrapper"
        [style.height.px]="highlightsVisibleHeight()"
        [style.opacity]="highlightsOpacity()"
      >
        <div #highlightsContent class="animation-content">
          <div class="toggle-highlights-row">
            <div class="divider"></div>
          </div>

          <rs-match-highlights
            class="match-highlights"
            [data]="matchInfo"
            [highlights]="highlights()!"
          />
        </div>
      </div>
      }
    </div>
  `,
})
export class MatchHeaderComponent implements OnDestroy, AfterViewInit {
  readonly data = input.required<FixtureDTO | undefined>();
  readonly highlights = input.required<FixtureHighlights | undefined>();

  private readonly scrollService = inject(ScrollService);
  readonly highlightsVisibleHeight = this.scrollService.highlightsVisibleHeight;
  readonly highlightsOpacity = this.scrollService.highlightsOpacity;

  @ViewChild('highlightsContent', { read: ElementRef })
  set highlightsContent(ref: ElementRef<HTMLElement> | undefined) {
    this.scrollService.setHighlightsContent(ref);
  }

  @HostListener('window:scroll')
  onScroll(): void {
    if (this.scrollService.scrollFrame !== null) {
      return;
    }

    this.scrollService.scrollFrame = requestAnimationFrame(() => {
      this.scrollService.setScrollY(window.scrollY);
      this.scrollService.scrollFrame = null;
    });
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

  ngAfterViewInit(): void {
    const onScroll = () => {
      if (this.scrollService.scrollFrame !== null) {
        return;
      }

      this.scrollService.scrollFrame = requestAnimationFrame(() => {
        this.scrollService.setScrollY(window.scrollY);
        this.scrollService.scrollFrame = null;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    this.scrollService.destroyScrollListener = () => {
      window.removeEventListener('scroll', onScroll);
    };
  }

  ngOnDestroy(): void {
    this.scrollService.destroyScrollListener?.();

    if (this.scrollService.scrollFrame !== null) {
      cancelAnimationFrame(this.scrollService.scrollFrame);
    }

    this.scrollService.disconnectObserver();
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
