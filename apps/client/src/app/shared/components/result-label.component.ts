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
    <span>{{ result().home }}</span>
    @if (isPostponed()) { @if (showPostponedText()) {
    <span class="text-fb-font-size-small"> Abgesagt </span> } @else { － } }
    @else if (isNotStarted()) { vs } @else { : }
    <span>{{ result().away }}</span>
  `,
})
export class ResultLabelComponent {
  result = input.required<Goals>();
  status = input.required<string>();
  isNotStarted = input<boolean>();
  showPostponedText = input<boolean>(false);

  isDefined = computed(() => this.result()?.home !== null);
  isPostponed = computed(() => this.status() === 'PST');
}
