import { DatePipe, formatDate } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  untracked,
} from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { RouterModule } from '@angular/router';

import type { ExtendedFixtureDTO } from '@lib/models';

import { linkToMatch } from '../../../../constants';
import {
  type FixtureStatusState,
  getFixtureStatusState,
} from '../../../../helper';
import { getTeamLogo, getTeamLogoSrcSet } from '../../../../models';
import { TeamNamePipe } from '../../../../pipes';
import { ResponsiveImageComponent } from '../../../responsive-image/responsive-image.component';
import { ResultLabelComponent } from '../../../result-label.component';

import { TIMEZONE } from '@lib/shared';
import { FixtureListItemFacade } from './fixture-list-item.facade';

const EXTERNAL_MODULES = [MatRippleModule, DatePipe, RouterModule];

@Component({
  selector: 'rs-fixture-list-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ...EXTERNAL_MODULES,
    ResponsiveImageComponent,
    TeamNamePipe,
    ResultLabelComponent,
  ],
  providers: [FixtureListItemFacade],
  styles: `
    a { @apply flex items-stretch; }
    :host > div { @apply inline-flex flex-col; }
    .time-label.is-finished { @apply line-through decoration-rs-color-primary; }
    .time {
      @apply justify-center items-center min-w-[40px] text-rs-font-size-small;

      &.is-playing { @apply bg-rs-color-green text-white; }
    }
    .time, .result {
      @apply flex text-center justify-center;
    }
    .result {
      @apply h-full min-w-[42px] px-2 items-center gap-[0.1rem];
    }
    .result:not(.is-upcoming),  .time.is-upcoming {
      background-color: var(--rs-color-surface-2);
    }
    .teams { @apply w-full flex items-center text-rs-font-size-body-2; }
    .teams > div:not(.result) { @apply flex flex-1 px-2 py-1 gap-2 items-center h-fit; }
    .teams > div:first-of-type { @apply justify-end text-end; }
    .team-name { line-height: 24px; text-wrap: balance; }
  `,
  template: `
    @let match = fixture();
    <a matRipple [routerLink]="fixtureLink()">
      <div
        class="time"
        [class.is-upcoming]="statusState().isUpcoming"
        [class.is-playing]="statusState().isLive"
      >
        <span class="time-label" [class.is-finished]="statusState().isFinished">
          @if (timeLabel(); as label) {
          <span class="truncate text-ellipsis">{{ label }}</span>
          } @else {
          {{ match.fixture.date | date : 'HH:mm' }}
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
        <div class="result" [class.is-upcoming]="statusState().isUpcoming">
          <rs-result-label [fixture]="fixture()" />
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
export class FixtureListItemComponent {
  readonly fixture = input.required<ExtendedFixtureDTO>();

  private readonly facade = inject(FixtureListItemFacade);
  readonly scheduled = this.facade.scheduled;
  readonly playing = this.facade.playing;
  readonly finished = this.facade.finished;
  readonly halfTime = this.facade.halfTime;

  readonly statusState = computed<FixtureStatusState>(() =>
    getFixtureStatusState(this.fixture().fixture.status.short)
  );

  readonly timeLabel = computed<string>(() => {
    const fixture = this.fixture();
    const state = this.statusState();

    if (state.isPenalty) return 'Elfm.';
    if (state.isHalftime) return 'HZ';
    if (state.isPlaying) return `${fixture.fixture.status.elapsed}'`;
    if (state.isFinished) {
      return formatDate(fixture.fixture.date, 'HH:mm', 'de-DE', TIMEZONE);
    }

    return '';
  });

  readonly isHomeEliminated = computed(() =>
    this.facade.isTeamEliminated(untracked(this.fixture), 'home')
  );
  readonly isAwayEliminated = computed(() =>
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
  readonly fixtureLink = computed<string[]>(() =>
    linkToMatch(untracked(this.fixture))
  );
}
