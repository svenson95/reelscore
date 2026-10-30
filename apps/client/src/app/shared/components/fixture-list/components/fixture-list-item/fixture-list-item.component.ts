import type { OnDestroy } from '@angular/core';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { Router } from '@angular/router';

import { formatFixtureTime } from '@reelscore-sdk/helpers';
import type { ExtendedFixtureDTO, Goals } from '@reelscore-sdk/models';

import { TeamNamePipe } from '../../../../pipes';
import {
  type FixtureStatusState,
  getFixtureStatusState,
  getTeamLogo,
  getTeamLogoSrcSet,
  linkToMatch,
  navigateToFixtureAfterVenueImage,
} from '../../../../utils';
import { ResponsiveImageComponent } from '../../../responsive-image/responsive-image.component';
import { ResultLabelComponent } from '../../../result-label.component';

import { FixtureListItemFacade } from './fixture-list-item.facade';

const MAT_MODULES = [MatRippleModule];
const SCORE_UPDATE_HIGHLIGHT_DURATION_MS = 2 * 60 * 1000;
type ScoreSide = 'home' | 'away';
const SCORE_SIDES: readonly ScoreSide[] = ['home', 'away'];

@Component({
  selector: 'rs-fixture-list-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ...MAT_MODULES,
    ResponsiveImageComponent,
    TeamNamePipe,
    ResultLabelComponent,
  ],
  providers: [FixtureListItemFacade],
  styles: `
    :host > div {
      @apply inline-flex flex-col;
    }

    :host(.is-last) a {
      @apply rounded-b-border2;
    }

    a {
      @apply flex items-stretch;
    }

    .time-label.is-finished {
      @apply line-through decoration-rs-color-primary;
    }

    .time {
      @apply flex-none justify-center items-center self-center min-w-[40px] h-fit py-[2px] text-rs-font-size-small;
    }

    .time,
    .result {
      @apply flex text-center justify-center rounded-border1;

      &.is-playing {
        @apply text-rs-color-green font-medium;
      }
    }

    .time.is-interrupted {
      @apply text-rs-color-primary font-medium;
    }

    .result {
      @apply flex-none min-w-[42px] px-2 items-center gap-[0.1rem];
    }

    .result:not(.is-upcoming) {
      background-color: var(--mat-sys-surface);

      @media (prefers-color-scheme: dark) {
        box-shadow: rgba(0,0,0,.3) 0px 2px 4px 0px inset;
      }

      @media (prefers-color-scheme: light) {
        box-shadow: rgba(0,0,0,.15) 0px 2px 4px 0px inset;
      }
    }

    .teams {
      @apply w-full flex flex-1 min-w-0 items-center text-rs-font-size-body-3;
    }

    .teams > div:not(.result) {
      @apply flex flex-1 min-w-0 p-2 gap-2 items-center h-fit;
    }

    .teams > div:first-of-type {
      @apply justify-end text-end;
    }

    .team-name {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  `,
  template: `
    @let match = fixture();
    <a
      matRipple
      [href]="fixtureHref()"
      (click)="navigateToMatch($event)"
      data-testid="fixture-list-item"
    >
      <div
        class="time"
        [class.is-upcoming]="statusState().isScheduled"
        [class.is-playing]="statusState().isLive"
        [class.is-interrupted]="statusState().status === 'INT'"
      >
        <span class="time-label" [class.is-finished]="statusState().isFinished">
          @if (timeLabel(); as label) {
          <span class="truncate text-ellipsis">{{ label }}</span>
          } @else {
          {{ formattedFixtureTime() }}
          }
        </span>
      </div>
      <div class="teams">
        <div>
          <span class="team-name" [class.line-through]="isHomeEliminated()">
            {{ match.teams.home.name | teamName : 'short' }}
          </span>
          <div class="team-logo-small">
            <rs-responsive-image
              [source]="homeLogo()"
              [sourceSet]="homeLogoSrcSet()"
              altText="home logo"
              [width]="14"
              [height]="14"
            />
          </div>
        </div>
        <div
          class="result"
          [class.is-upcoming]="statusState().isScheduled"
          [class.is-playing]="statusState().isLive"
        >
          <rs-result-label
            [fixture]="fixture()"
            [highlightHomeScore]="highlightedScoreSides().home"
            [highlightAwayScore]="highlightedScoreSides().away"
          />
        </div>
        <div>
          <div class="team-logo-small">
            <rs-responsive-image
              [source]="awayLogo()"
              [sourceSet]="awayLogoSrcSet()"
              altText="away logo"
              [width]="14"
              [height]="14"
            />
          </div>
          <span class="team-name" [class.line-through]="isAwayEliminated()">
            {{ match.teams.away.name | teamName : 'short' }}
          </span>
        </div>
      </div>
    </a>
  `,
})
export class FixtureListItemComponent implements OnDestroy {
  readonly fixture = input.required<ExtendedFixtureDTO>();

  private readonly facade = inject(FixtureListItemFacade);
  private readonly router = inject(Router);
  private previousScore: Goals | null = null;
  private readonly scoreUpdateTimeouts: Record<
    ScoreSide,
    ReturnType<typeof setTimeout> | null
  > = {
    home: null,
    away: null,
  };

  readonly highlightedScoreSides = signal<Record<ScoreSide, boolean>>({
    home: false,
    away: false,
  });

  private readonly scoreUpdateEffect = effect(() => {
    this.updateScoreHighlight(this.fixture().goals);
  });

  readonly statusState = computed<FixtureStatusState>(() =>
    getFixtureStatusState(this.fixture().fixture.status.short)
  );

  readonly formattedFixtureTime = computed(() => {
    return formatFixtureTime(this.fixture().fixture.timestamp);
  });

  readonly timeLabel = computed<string>(() => {
    const fixture = this.fixture();
    const state = this.statusState();

    if (state.isPenalty) return 'Elfm.';
    if (state.isHalftime) return 'HZ';

    if (state.isPlaying) {
      if (state.status === 'INT') return 'Unt.';

      const { elapsed, extra } = fixture.fixture.status;
      return `${(elapsed ?? 0) + (extra ?? 0)}'`;
    }

    if (state.isFinished) {
      return formatFixtureTime(fixture.fixture.timestamp);
    }

    return '';
  });

  readonly isHomeEliminated = computed<boolean>(() =>
    this.facade.isTeamEliminated(untracked(this.fixture), 'home')
  );
  readonly isAwayEliminated = computed<boolean>(() =>
    this.facade.isTeamEliminated(untracked(this.fixture), 'away')
  );

  readonly homeLogo = computed<string>(() =>
    getTeamLogo(untracked(this.fixture).teams.home.id, 14)
  );
  readonly homeLogoSrcSet = computed<string>(() =>
    getTeamLogoSrcSet(untracked(this.fixture).teams.home.id, 14)
  );
  readonly awayLogo = computed<string>(() =>
    getTeamLogo(untracked(this.fixture).teams.away.id, 14)
  );
  readonly awayLogoSrcSet = computed<string>(() =>
    getTeamLogoSrcSet(untracked(this.fixture).teams.away.id, 14)
  );
  readonly fixtureLink = computed<string[]>(() => linkToMatch(this.fixture()));
  readonly fixtureHref = computed<string>(() =>
    this.router.serializeUrl(this.router.createUrlTree(this.fixtureLink()))
  );

  ngOnDestroy(): void {
    for (const side of SCORE_SIDES) {
      const timeout = this.scoreUpdateTimeouts[side];

      if (timeout !== null) {
        clearTimeout(timeout);
      }
    }
  }

  protected navigateToMatch(event: MouseEvent): void {
    void navigateToFixtureAfterVenueImage(
      event,
      this.fixture(),
      this.fixtureLink(),
      this.router
    );
  }

  private updateScoreHighlight(score: Goals): void {
    if (this.previousScore === null) {
      this.previousScore = score;
      return;
    }

    const homeScoreChanged = score.home !== this.previousScore.home;
    const awayScoreChanged = score.away !== this.previousScore.away;
    this.previousScore = score;

    if (homeScoreChanged) {
      this.highlightScoreSide('home');
    }

    if (awayScoreChanged) {
      this.highlightScoreSide('away');
    }
  }

  private highlightScoreSide(side: ScoreSide): void {
    const existingTimeout = this.scoreUpdateTimeouts[side];

    if (existingTimeout !== null) {
      clearTimeout(existingTimeout);
    }

    this.highlightedScoreSides.update((highlightedSides) => ({
      ...highlightedSides,
      [side]: true,
    }));

    this.scoreUpdateTimeouts[side] = setTimeout(() => {
      this.highlightedScoreSides.update((highlightedSides) => ({
        ...highlightedSides,
        [side]: false,
      }));
      this.scoreUpdateTimeouts[side] = null;
    }, SCORE_UPDATE_HIGHLIGHT_DURATION_MS);
  }
}
