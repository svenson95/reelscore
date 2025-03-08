import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

import { Goals } from '@lib/models';

@Component({
  selector: 'reelscore-result-label',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  styles: `
    :host { @apply flex justify-center items-center gap-[0.15rem]; }
  `,
  template: `
    @if(isDefined()) {
    <span>{{ result()?.home }}</span>
    } @if (isPostponed()) {
    <span class="text-fb-font-size-small">
      @if (showPostponed()) { Abgesagt }
    </span>
    } @else {
    <span class="result-divider">
      @if (isNotStarted()) { － } @else { : }
    </span>
    } @if(isDefined()) {
    <span>{{ result()?.away }}</span>
    }
  `,
})
export class ResultLabelComponent {
  result = input.required<Goals | null>();
  status = input.required<string>();
  isNotStarted = input<boolean>();
  showPostponed = input<boolean>(false);

  isDefined = computed(() => this.result()?.home !== null);
  isPostponed = computed(() => this.status() === 'PST');
}
