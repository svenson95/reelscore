import type { AfterViewInit, OnDestroy } from '@angular/core';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  ViewChild,
} from '@angular/core';

import type { ExtendedFixtureDTO, FixtureHighlights } from '@lib/models';

import { MatchHighlightsComponent, MatchInfoComponent } from './components';
import { ALLIANZ_ARENA_ID, ScrollService, VenueImageService } from './services';
import { VENUE_IDS } from './venue-ids.data';

@Component({
  selector: 'section[rs-match-header]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatchInfoComponent, MatchHighlightsComponent],
  providers: [ScrollService, VenueImageService],
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
      --highlights-height: 0px;
      --highlights-progress: 0;

      height: calc(
        var(--highlights-height) * (1 - var(--highlights-progress))
      );

      opacity: calc(1 - var(--highlights-progress));

      overflow: clip;
      contain: layout paint style;

      will-change: height, opacity;
    }

    @supports not (overflow: clip) {
      .animation-wrapper {
        overflow: hidden;
      }
    }

    .animation-content {
      transform: translate3d(
        0,
        calc(var(--highlights-height) * var(--highlights-progress) * -0.15),
        0
      );

      will-change: transform;
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
      <div #animationWrapper class="animation-wrapper">
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
  readonly data = input.required<ExtendedFixtureDTO | null>();
  readonly highlights = input.required<FixtureHighlights | null>();

  @ViewChild('animationWrapper', { read: ElementRef })
  set animationWrapper(ref: ElementRef<HTMLElement> | null) {
    this.scrollService.setAnimationWrapper(ref);
  }

  @ViewChild('highlightsContent', { read: ElementRef })
  set highlightsContent(ref: ElementRef<HTMLElement> | null) {
    this.scrollService.setHighlightsContent(ref);
  }

  private readonly scrollService = inject(ScrollService);

  private readonly venueImageService = inject(VenueImageService);
  readonly hasValidVenueBackground =
    this.venueImageService.hasValidVenueBackground;
  readonly venueBackgroundLoaded = this.venueImageService.venueBackgroundLoaded;
  readonly venueBackgroundImage = this.venueImageService.venueBackgroundImage;

  readonly venueId = computed<number | null>(() => {
    const data = this.data();
    if (!data) return null;
    return VENUE_IDS[data.teams.home.id] ?? ALLIANZ_ARENA_ID;
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

  venueServiceEffect = effect(() => {
    this.venueImageService.setVenueId(this.venueId());
  });

  ngAfterViewInit(): void {
    this.scrollService.observeScrollPosition();
  }

  ngOnDestroy(): void {
    this.scrollService.destroy();
  }
}
