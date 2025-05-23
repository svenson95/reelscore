import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

import {
  OptimizedImageComponent,
  ResultLabelComponent,
  TeamNamePipe,
  getTeamLogo,
} from '@app/shared';
import {
  FixtureDTO,
  STATUS_TYPES_FINISHED,
  STATUS_TYPES_PLAYING,
  STATUS_TYPES_SCHEDULED,
} from '@lib/models';

@Component({
  selector: 'rs-match-header-data',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OptimizedImageComponent, TeamNamePipe, ResultLabelComponent],
  styles: `
    :host { @apply flex w-full; }
    div { @apply flex flex-1 sm:text-rs-font-size-body-1; }
    .team-column { @apply flex-col gap-2 text-rs-font-size-body-2; }
    .result-column { @apply relative items-center justify-center gap-1 text-rs-font-size-body-1; }
    .status { @apply absolute top-0 py-[.15rem] px-2 text-rs-font-size-small font-mono; }
    .status.is-playing { @apply bg-green-600 text-rs-color-text-3; }
    .status.is-finished { @apply bg-gray-600 text-rs-color-text-3; }
    .team-name { @apply leading-[16px] text-center; }
    .team-logo { @apply m-auto; }
    .team-name-placeholder { @apply w-[100px] h-[16px] bg-gray-200 rounded m-auto; }
    .team-logo-placeholder { @apply w-[48px] h-[48px] bg-gray-200 rounded-full self-center; }
  `,
  template: `
    @let fixture = data();
    <div class="team-column">
      <div class="team-logo">
        @if (fixture) {
        <rs-optimized-image
          [source]="homeLogo()"
          altText="home logo"
          width="48"
          height="48"
        />
        } @else {
        <div class="team-logo-placeholder"></div>
        }
      </div>
      <span class="team-name">
        @if (fixture) {
        {{ fixture.teams.home.name | teamName }}
        } @else {
        <div class="team-name-placeholder"></div>
        }
      </span>
    </div>

    <div class="result-column">
      @if (fixture) {
      <div
        class="status"
        [class.is-playing]="isPlaying()"
        [class.is-finished]="isFinished()"
      >
        @if (isPlaying()) {
        {{ fixture.fixture.status.elapsed }}' } @else if (isFinished()) { FT }
      </div>
      <rs-result-label
        [result]="fixture.goals"
        [status]="fixture.fixture.status.short"
        [isScheduled]="isScheduled()"
        [showPostponedText]="true"
      />
      }
    </div>

    <div class="team-column">
      <div class="team-logo">
        @if (fixture) {
        <rs-optimized-image
          [source]="awayLogo()"
          altText="away logo"
          width="48"
          height="48"
        />
        } @else {
        <div class="team-logo-placeholder"></div>
        }
      </div>
      <span class="team-name">
        @if (fixture) {
        {{ fixture.teams.away.name | teamName }}
        } @else {
        <div class="team-name-placeholder"></div>
        }
      </span>
    </div>
  `,
})
export class HeaderDataComponent {
  data = input.required<FixtureDTO | undefined>();

  isLoaded = computed<boolean>(() => !!this.data());

  homeLogo = computed<string>(() => {
    const id = this.data()?.teams.home.id ?? 0;
    return getTeamLogo(id);
  });
  awayLogo = computed<string>(() => {
    const id = this.data()?.teams.away.id ?? 0;
    return getTeamLogo(id);
  });

  isScheduled = computed<boolean>(() => {
    const fixture = this.data();
    if (!fixture) return false;

    return STATUS_TYPES_SCHEDULED.some(
      (s) => s === fixture.fixture.status.short
    );
  });

  isPlaying = computed<boolean>(() => {
    const fixture = this.data();
    if (!fixture) return false;

    return STATUS_TYPES_PLAYING.some((v) => v === fixture.fixture.status.short);
  });

  isFinished = computed<boolean>(() => {
    const fixture = this.data();
    if (!fixture) return false;

    return STATUS_TYPES_FINISHED.some(
      (status) => status === fixture.fixture.status.short
    );
  });
}
