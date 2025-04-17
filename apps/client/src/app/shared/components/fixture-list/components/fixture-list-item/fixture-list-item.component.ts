import { DatePipe } from '@angular/common';
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

import { ExtendedFixtureDTO } from '@lib/models';

import { linkToMatch } from '../../../../constants';
import { getTeamLogo } from '../../../../models';
import { IsStatusPipe, TeamNamePipe } from '../../../../pipes';
import { OptimizedImageComponent } from '../../../optimized-image/optimized-image.component';
import { ResultLabelComponent } from '../../../result-label.component';
import { FixtureListItemFacade } from './fixture-list-item.facade';

const ANGULAR_MODULES = [MatRippleModule, DatePipe, RouterModule];

@Component({
  selector: 'rs-fixture-list-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ...ANGULAR_MODULES,
    OptimizedImageComponent,
    TeamNamePipe,
    IsStatusPipe,
    ResultLabelComponent,
  ],
  providers: [FixtureListItemFacade],
  styles: `
    a { @apply flex items-stretch; }
    :host > div { @apply inline-flex flex-col; }
    .time-label.is-finished { @apply line-through decoration-rs-color-orange; }
    .time { 
      @apply justify-center items-center min-w-[50px] text-rs-font-size-small; 

      &.is-upcoming { @apply bg-rs-color-white-2; }
      &.is-playing { @apply bg-rs-color-green-1 text-rs-color-text-3; }
    }
    .time, .result { 
      @apply flex text-center justify-center;
    }
    .result { 
      @apply min-w-[40px] p-2 items-center gap-[0.1rem]; 

      &:not(.is-upcoming) { @apply bg-rs-color-white-2; }
    }
    .teams { @apply w-full flex text-rs-font-size-body-2; }
    .teams > div:not(.result) { @apply flex flex-1 p-2 gap-2 items-center; }
    .teams > div:first-of-type { @apply justify-end text-end; }
    .team-name { line-height: 14px; text-wrap: balance; }
    .team-logo { 
      @apply w-[14px] h-[14px]; 

      &-placeholder { @apply w-[14px] h-[14px] bg-gray-200 rounded; }
    }
  `,
  template: `
    @let match = fixture();
    <a matRipple [routerLink]="fixtureLink()">
      <div
        class="time"
        [class.is-upcoming]="match | isStatus : notStarted"
        [class.is-playing]="
          (match | isStatus : playing : finished) ||
          (match | isStatus : halfTime)
        "
      >
        <span
          class="time-label"
          [class.is-finished]="match | isStatus : finished"
        >
          @if (match | isStatus : playing : finished) {
          {{ match.fixture.status.elapsed }}' } @else if (match | isStatus :
          halfTime) { HZ } @else {
          {{ match.fixture.date | date : 'HH:mm' }}
          }
        </span>
      </div>
      <div class="teams">
        <div>
          <span class="team-name" [class.line-through]="isHomeEliminated()">
            {{ match.teams.home.name | teamName : 'short' }}
          </span>
          <div class="team-logo">
            @defer (on viewport) {
            <rs-optimized-image
              [source]="homeLogo()"
              alternate="home logo"
              width="14"
              height="14"
            />
            } @placeholder {
            <div class="team-logo-placeholder"></div>
            }
          </div>
        </div>
        <div class="result" [class.is-upcoming]="match | isStatus : notStarted">
          <rs-result-label
            [result]="match.goals"
            [status]="match.fixture.status.short"
            [isNotStarted]="match | isStatus : notStarted"
          />
        </div>
        <div>
          <div class="team-logo">
            @defer (on viewport) {
            <rs-optimized-image
              [source]="awayLogo()"
              alternate="away logo"
              width="14"
              height="14"
            />
            } @placeholder {
            <div class="team-logo-placeholder"></div>
            }
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
  fixture = input.required<ExtendedFixtureDTO>();

  private facade = inject(FixtureListItemFacade);
  notStarted = this.facade.notStarted;
  playing = this.facade.playing;
  finished = this.facade.finished;
  halfTime = this.facade.halfTime;

  isHomeEliminated = computed(() =>
    this.facade.isTeamEliminated(untracked(this.fixture), 'home')
  );
  isAwayEliminated = computed(() =>
    this.facade.isTeamEliminated(untracked(this.fixture), 'away')
  );

  homeLogo = computed<string>(() =>
    getTeamLogo(untracked(this.fixture).teams.home.id)
  );
  awayLogo = computed<string>(() =>
    getTeamLogo(untracked(this.fixture).teams.away.id)
  );
  fixtureLink = computed<string[]>(() => linkToMatch(untracked(this.fixture)));
}
