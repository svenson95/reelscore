import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

import {
  type FixtureDTO,
  type Goals,
  STATUS_TYPES_NOT_PLAYED,
  STATUS_TYPES_SCHEDULED,
  STATUS_VALUE_ABANDONED,
  STATUS_VALUE_CANCELLED,
  STATUS_VALUE_POSTPONED,
  StatusShort,
} from '@lib/models';

@Component({
  selector: 'rs-result-label',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  template: `
    @if (isPenaltyShootout()) {
    <span class="mr-1 text-rs-font-size-small">n.E.</span>
    <span>{{ penaltyResult().home }}:{{ penaltyResult().away }}</span>
    } @else {
    <span>{{ mainResult().home }}</span>

    @if (isNotPlayed()) { @if (showNotPlayedText()) {
    <span class="text-rs-font-size-small"> Abgesagt </span>
    } @else { － } } @else if (isScheduled()) { vs } @else { : }

    <span>{{ mainResult().away }}</span>
    }
  `,
})
export class ResultLabelComponent {
  readonly fixture = input.required<FixtureDTO>();
  readonly status = input.required<StatusShort>();
  readonly showNotPlayedText = input<boolean>(false);

  readonly mainResult = computed<Goals>(() => this.fixture().goals);
  readonly penaltyResult = computed<Goals>(() => this.fixture().score.penalty);

  readonly isNotPlayed = computed<boolean>(() => {
    const status = this.status();
    return (
      status === STATUS_VALUE_POSTPONED ||
      status === STATUS_VALUE_CANCELLED ||
      status === STATUS_VALUE_ABANDONED ||
      STATUS_TYPES_NOT_PLAYED.includes(status)
    );
  });

  readonly isScheduled = computed<boolean>(() =>
    STATUS_TYPES_SCHEDULED.includes(this.status())
  );

  readonly isPenaltyShootout = computed<boolean>(() => {
    const penalty = this.penaltyResult();

    return (
      this.status() === 'PEN' &&
      penalty.home !== null &&
      penalty.away !== null &&
      penalty.home !== undefined &&
      penalty.away !== undefined
    );
  });
}
