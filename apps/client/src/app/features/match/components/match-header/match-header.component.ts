import type { AfterViewInit, OnDestroy } from '@angular/core';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  Input,
  input,
  signal,
} from '@angular/core';

import type {
  ExtendedFixtureDTO,
  FixtureHighlights,
  FixtureId,
} from '@reelscore-sdk/models';

import {
  ALLIANZ_ARENA_ID,
  getCompetitionRoundLabel,
  takePreparedFixtureVenueImage,
  VENUE_IDS,
} from '@app/shared';

import {
  CollapsibleScrollSection,
  MatchHighlightsComponent,
  MatchInfoComponent,
} from './components';
import { ScrollService, VenueImageService } from './data-access';

@Component({
  selector: 'section[rs-match-header]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatchInfoComponent,
    MatchHighlightsComponent,
    CollapsibleScrollSection,
  ],
  providers: [ScrollService, VenueImageService],
  styles: `
    :host {
      @apply px-3;
      margin-top: -1.25rem;
      text-shadow: 0 0 4px var(--rs-color-text-3);
    }

    .wrapper {
      @apply flex flex-col mx-auto p-5 rounded-border2 w-full max-w-rs-max-width shadow-rs bg-rs-button-bg;
      position: relative;
      & > *:not(.background-wrapper) { z-index: 3; }
    }

    .background-wrapper {
      @apply bg-[0_70%] opacity-0 z-[1] bg-no-repeat bg-cover w-full h-full rounded-border2;

      position: absolute;
      top: 0;
      left: 0;

      &--loaded {
        opacity: 0.2;
      }
    }

    .toggle-highlights-row {
      @apply flex items-center py-rs1 overflow-hidden;
      will-change: height, opacity;

      .divider {
        @apply w-full h-[1px] bg-rs-border-color-2;
      }
    }

    .competition-label {
      @apply mb-4 flex min-h-[49px] items-center justify-center text-rs-font-size-small font-medium leading-4 text-rs-color-text-1 md:min-h-[16px];
    }

    .competition-label-content {
      @apply block w-full text-center;
    }

    .competition-label-placeholder {
      @apply h-[12px] w-[160px] rounded;
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
      <div class="competition-label">
        @if (matchInfo) {
        <span class="competition-label-content">
          {{ matchInfo.league.name }} ·
          {{
          getCompetitionRoundLabel(matchInfo.league.round, {
            id: matchInfo.league.id,
            season: matchInfo.league.season,
          })
          }}
        </span>
        } @else {
        <span
          class="rs-skeleton competition-label-placeholder"
          aria-hidden="true"
        ></span>
        }
      </div>

      <rs-match-info [data]="matchInfo" />

      @if (highlights()?.length && matchInfo) {
      <rs-collapsible-scroll-section>
        <div class="toggle-highlights-row">
          <div class="divider"></div>
        </div>

        <rs-match-highlights
          class="match-highlights"
          [data]="matchInfo"
          [highlights]="highlights()!"
        />
      </rs-collapsible-scroll-section>
      }
    </div>
  `,
})
export class MatchHeaderComponent implements OnDestroy, AfterViewInit {
  readonly data = input.required<ExtendedFixtureDTO | null>();
  readonly highlights = input.required<FixtureHighlights | null>();

  private readonly scrollService = inject(ScrollService);
  private readonly venueImageService = inject(VenueImageService);
  private readonly selectedFixtureId = signal<number | null>(null);
  private readonly preparedVenueId = signal<number | null>(null);

  @Input()
  set fixtureId(fixtureId: FixtureId) {
    this.selectedFixtureId.set(Number(fixtureId));
    const preparedImage = takePreparedFixtureVenueImage(fixtureId);
    this.preparedVenueId.set(preparedImage?.venueId ?? null);

    if (preparedImage) {
      this.venueImageService.setPreparedVenueImage(
        preparedImage.venueId,
        preparedImage.imageUrl
      );
    }
  }

  protected readonly getCompetitionRoundLabel = getCompetitionRoundLabel;

  readonly hasValidVenueBackground =
    this.venueImageService.hasValidVenueBackground;
  readonly venueBackgroundLoaded = this.venueImageService.venueBackgroundLoaded;
  readonly venueBackgroundImage = this.venueImageService.venueBackgroundImage;

  readonly venueId = computed<number | null>(() => {
    const data = this.data();
    const selectedFixtureId = this.selectedFixtureId();

    if (
      !data ||
      (selectedFixtureId !== null &&
        Number(data.fixture.id) !== selectedFixtureId)
    ) {
      return this.preparedVenueId();
    }

    return VENUE_IDS[data.teams.home.id] ?? ALLIANZ_ARENA_ID;
  });

  ngAfterViewInit(): void {
    this.scrollService.observeScrollPosition();
  }

  ngOnDestroy(): void {
    this.scrollService.destroy();
  }

  private readonly venueServiceEffect = effect(() => {
    this.venueImageService.setVenueId(this.venueId());
  });
}
