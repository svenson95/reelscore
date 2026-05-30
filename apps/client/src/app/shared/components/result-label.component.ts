import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

import {
  type Goals,
  type Score,
  STATUS_TYPES_SCHEDULED,
  STATUS_VALUE_POSTPONED,
  type StatusTypePostponed,
  type StatusTypeScheduled,
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

    @if (isPostponed()) { @if (showPostponedText()) {
    <span class="text-rs-font-size-small"> Abgesagt </span>
    } @else { － } } @else if (isScheduled()) { vs } @else { : }

    <span>{{ mainResult().away }}</span>
    }
  `,
})
export class ResultLabelComponent {
  readonly result = input.required<Score>();
  readonly status = input.required<string>();

  readonly showPostponedText = input<boolean>(false);

  readonly mainResult = computed<Goals>(() => this.result().fulltime);

  readonly penaltyResult = computed<Goals>(() => this.result().penalty);

  readonly isPostponed = computed<boolean>(() =>
    STATUS_VALUE_POSTPONED.includes(this.status() as StatusTypePostponed)
  );

  readonly isScheduled = computed<boolean>(() =>
    STATUS_TYPES_SCHEDULED.includes(this.status() as StatusTypeScheduled)
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
