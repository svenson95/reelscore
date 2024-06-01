import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { MatchDTO } from '@lib/models';

import { BackButtonComponent } from '../../../../components';

import { MatchHeaderComponent } from '../../components';

@Component({
  selector: 'futbet-match-content',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BackButtonComponent, DatePipe, MatchHeaderComponent],
  styles: `
    :host { @apply flex flex-col gap-5; }
    .header { @apply flex items-center justify-between;}
    .date-label { @apply text-fb-font-size-body-2 mr-3; }
  `,
  template: `
    <section class="header">
      <futbet-back-button />

      <span class="date-label">
        {{ data().fixture.date | date : 'HH:mm | dd.MM.yy' }}
      </span>
    </section>

    <section>
      <futbet-match-header [data]="data()" />

      <!-- @switch(isUpcoming()) { @case(true) {
        <futbet-match-before-details />
        } @case(false) {
        <futbet-match-after-details />
        }} -->
    </section>
  `,
})
export class MatchContentComponent {
  data = input.required<MatchDTO>();
}
