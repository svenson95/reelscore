import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

import { ResultLabelComponent } from '@app/shared';
import {
  type FixtureDTO,
  STATUS_TYPES_FINISHED,
  STATUS_TYPES_PLAYING,
  STATUS_TYPES_SCHEDULED,
  type StatusTypeFinished,
  type StatusTypePlaying,
  type StatusTypeScheduled,
} from '@lib/models';

import {
  type MatchHeaderTeam,
  MatchInfoTeamComponent,
} from './components/match-info-team.component';

@Component({
  selector: 'rs-match-info',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatchInfoTeamComponent, ResultLabelComponent],
  styles: `
    :host { @apply flex w-full; }
    .result-column {
      @apply relative flex flex-1 items-center justify-center gap-1 text-rs-font-size-body-1 sm:text-rs-font-size-body-1;
    }
    .status { @apply absolute top-[-5px] py-[.15rem] px-2 text-rs-font-size-small; text-shadow: none; }
    .status.is-playing { @apply bg-rs-color-green text-white border border-solid font-semibold; }
    .status.is-finished { @apply bg-gray-600 text-white border border-solid; }
  `,
  template: `
    @let fixture = data();

    <rs-match-info-team [team]="homeTeam()" />

    <div class="result-column">
      @if (fixture) { @if (statusLabel(); as label) {
      <div
        class="status"
        [class.is-playing]="isPlaying()"
        [class.is-finished]="isFinished()"
      >
        {{ label }}
      </div>
      }

      <rs-result-label
        [result]="fixture.goals"
        [status]="fixture.fixture.status.short"
        [isScheduled]="isScheduled()"
        [showPostponedText]="true"
      />
      }
    </div>

    <rs-match-info-team [team]="awayTeam()" />
  `,
})
export class MatchInfoComponent {
  readonly data = input.required<FixtureDTO | undefined>();

  readonly homeTeam = computed<MatchHeaderTeam | undefined>(() => {
    const fixture = this.data();
    if (!fixture) return undefined;
    return {
      id: fixture?.teams.home.id,
      name: fixture?.teams.home.name,
    };
  });

  readonly awayTeam = computed<MatchHeaderTeam | undefined>(() => {
    const fixture = this.data();
    if (!fixture) return undefined;
    return {
      id: fixture.teams.away.id,
      name: fixture.teams.away.name,
    };
  });

  readonly isScheduled = computed<boolean>(() => {
    const status = this.data()?.fixture.status.short;
    return (
      !!status && STATUS_TYPES_SCHEDULED.includes(status as StatusTypeScheduled)
    );
  });

  readonly isPlaying = computed<boolean>(() => {
    const status = this.data()?.fixture.status.short;
    return (
      !!status && STATUS_TYPES_PLAYING.includes(status as StatusTypePlaying)
    );
  });

  readonly isFinished = computed<boolean>(() => {
    const status = this.data()?.fixture.status.short;
    return (
      !!status && STATUS_TYPES_FINISHED.includes(status as StatusTypeFinished)
    );
  });

  readonly statusLabel = computed<string | undefined>(() => {
    if (this.isPlaying()) {
      return `${this.data()?.fixture.status.elapsed}'`;
    }

    if (this.isFinished()) {
      return 'FT';
    }

    return undefined;
  });
}
