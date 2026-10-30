import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

import {
  STATUS_VALUE_ABANDONED,
  STATUS_VALUE_CANCELLED,
  STATUS_VALUE_POSTPONED,
  STATUS_VALUES_NOT_PLAYED,
  STATUS_VALUES_SCHEDULED,
} from '@reelscore-sdk/constants';
import type { FixtureDTO, FixtureStatus, Goals } from '@reelscore-sdk/models';

import { type FixtureStatusState, getFixtureStatusState } from '../utils';

@Component({
  selector: 'rs-result-label',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  styles: `
    .is-goal-update {
      @apply text-rs-color-primary font-bold;
    }

    .is-goal-update.is-live {
      @apply text-rs-color-green;
    }
  `,
  template: `
    @if (isPenaltyShootout()) {
    <span class="mr-1 text-rs-font-size-small">n.E.</span>
    <span>{{ penaltyResult().home }}:{{ penaltyResult().away }}</span>
    } @else {
    <span
      [class.is-goal-update]="highlightHomeScore()"
      [class.is-live]="statusState().isLive"
    >
      {{ mainResult().home }}
    </span>

    @if (isNotPlayed()) { @if (!showNotPlayedText()) { － } } @else if
    (isScheduled()) { vs } @else { : }

    <span
      [class.is-goal-update]="highlightAwayScore()"
      [class.is-live]="statusState().isLive"
    >
      {{ mainResult().away }}
    </span>
    }
  `,
})
export class ResultLabelComponent {
  readonly fixture = input.required<FixtureDTO>();
  readonly showNotPlayedText = input<boolean>(false);
  readonly highlightHomeScore = input<boolean>(false);
  readonly highlightAwayScore = input<boolean>(false);

  readonly mainResult = computed<Goals>(() => this.fixture().goals);
  readonly penaltyResult = computed<Goals>(() => this.fixture().score.penalty);
  readonly statusState = computed<FixtureStatusState>(() =>
    getFixtureStatusState(this.status().short)
  );

  readonly isScheduled = computed<boolean>(() =>
    STATUS_VALUES_SCHEDULED.includes(this.status().short)
  );

  readonly isPenaltyShootout = computed<boolean>(() => {
    return this.status().short === 'P';
  });

  readonly isNotPlayed = computed<boolean>(() => {
    const status = this.status().short;
    return (
      status === STATUS_VALUE_POSTPONED ||
      status === STATUS_VALUE_CANCELLED ||
      status === STATUS_VALUE_ABANDONED ||
      STATUS_VALUES_NOT_PLAYED.includes(status)
    );
  });

  private readonly status = computed<FixtureStatus>(
    () => this.fixture().fixture.status
  );
}
