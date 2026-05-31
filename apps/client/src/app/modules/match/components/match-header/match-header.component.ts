import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  HostBinding,
  inject,
  input,
  NgZone,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounce, fromEvent, timer } from 'rxjs';

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

      &.is-scrolled { padding-top: env(safe-area-inset-top); }
    }

    .wrapper {
      @apply flex flex-col mx-auto p-5 rounded-fb w-full max-w-rs-max-width shadow-rs2 bg-rs-alt-bg;
      border: 1px solid var(--rs-button-border-color);
    }

    .toggle-highlights-row {
      &.is-hidden .divider { animation: opacityDown 200ms ease forwards; }
      .divider {
        @apply w-full h-[1px];
        background-color: var(--rs-button-border-color);
        animation: opacityUp 200ms ease forwards;
      }

      @keyframes opacityUp {
        0% { opacity: 0; margin-block: 0; }
        100% { opacity: 1; margin-block: .5rem; }
      }
      @keyframes opacityDown {
        0% { opacity: 1; margin-block: .5rem; }
        100% { opacity: 0; margin-block: 0; }
      }
    }

    .animation-wrapper {
      display: grid;
      grid-template-rows: 1fr;
      transition: grid-template-rows 200ms ease-out;
      &.is-hidden { grid-template-rows: 0fr; }
      .match-highlights { overflow: hidden; }
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
      <div class="toggle-highlights-row" [class.is-hidden]="isScrolled()">
        <div class="divider"></div>
      </div>

      <div class="animation-wrapper" [class.is-hidden]="isScrolled()">
        @if (data(); as data) {
        <rs-match-highlights
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
export class MatchHeaderComponent implements OnInit {
  readonly data = input.required<FixtureDTO | undefined>();
  readonly highlights = input.required<FixtureHighlights | undefined>();

  readonly isScrolled = signal<boolean>(false);

  private readonly ngZone = inject(NgZone);

  private readonly scrollEvent$ = fromEvent(window, 'scroll').pipe(
    takeUntilDestroyed(),
    debounce(() => timer(this.isScrolled() ? 10 : 0))
  );

  @HostBinding('class.is-scrolled')
  get isScrolledBinding(): boolean {
    return this.isScrolled();
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

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      this.scrollEvent$.subscribe(() => {
        this.ngZone.run(() => {
          const isScrolled = window.scrollY > 80;

          const maxScrollHeight = Math.max(
            document.body.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.clientHeight,
            document.documentElement.scrollHeight,
            document.documentElement.offsetHeight
          );

          const minScrollHeight = 1200;

          this.isScrolled.set(isScrolled && maxScrollHeight > minScrollHeight);
        });
      });
    });
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
