import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

import type { FixtureDTO, Goals } from '@reelscore-sdk/models';

import { type FixtureStatusState, getFixtureStatusState } from '../utils';

@Component({
  selector: 'rs-result-label',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.is-playing]': 'statusState().isLive',
  },
  styles: `
    :host {
      @apply font-normal leading-[1.4rem];
    }

    :host(.is-playing) {
      @apply text-rs-color-text-1 font-medium;
    }

    .is-goal-update {
      @apply text-rs-color-primary font-semibold;
    }
  `,
  // Prettier 2 does not support Angular's built-in control flow.
  // prettier-ignore
  template: `
    @if (statusState().isPenalty) {
      <span class="mr-1 text-rs-font-size-small">n.E.</span>
      <span>{{ penaltyResult().home }}:{{ penaltyResult().away }}</span>
    } @else {
      <span [class.is-goal-update]="highlightHomeScore()">
        {{ mainResult().home }}
      </span>

      @if (statusState().isNotPlayed) {
        @if (!showNotPlayedText()) {
          －
        }
      } @else if (statusState().isScheduled) {
        vs
      } @else {
        :
      }

      <span [class.is-goal-update]="highlightAwayScore()">
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

  protected readonly mainResult = computed<Goals>(() => this.fixture().goals);
  protected readonly penaltyResult = computed<Goals>(
    () => this.fixture().score.penalty
  );
  protected readonly statusState = computed<FixtureStatusState>(() =>
    getFixtureStatusState(this.fixture().fixture.status.short)
  );
}
