import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

import {
  type FixtureDTO,
  type FixtureStatus,
  type Goals,
  STATUS_TYPES_NOT_PLAYED,
  STATUS_TYPES_SCHEDULED,
  STATUS_VALUE_ABANDONED,
  STATUS_VALUE_CANCELLED,
  STATUS_VALUE_POSTPONED,
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

    @if (isNotPlayed()) { @if (!showNotPlayedText()) { － } } @else if
    (isScheduled()) { vs } @else {&#8239;:&#8239;}

    <span>{{ mainResult().away }}</span>
    }
  `,
})
export class ResultLabelComponent {
  readonly fixture = input.required<FixtureDTO>();
  readonly showNotPlayedText = input<boolean>(false);

  readonly mainResult = computed<Goals>(() => this.fixture().goals);
  readonly penaltyResult = computed<Goals>(() => this.fixture().score.penalty);

  readonly isScheduled = computed<boolean>(() =>
    STATUS_TYPES_SCHEDULED.includes(this.status().short)
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
      STATUS_TYPES_NOT_PLAYED.includes(status)
    );
  });

  private readonly status = computed<FixtureStatus>(
    () => this.fixture().fixture.status
  );
}
