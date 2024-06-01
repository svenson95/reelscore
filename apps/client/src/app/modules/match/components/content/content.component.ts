import { AsyncPipe, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';

import { MatchDTO } from '@lib/models';

import { BackButtonComponent } from '../../../../components';
import { FixtureStatisticsService } from '../../../../services';

import {
  MatchDetailsAfterComponent,
  MatchHeaderComponent,
} from '../../components';
import { MatchDetailsBaseComponent } from '../details/base/base.component';

@Component({
  selector: 'futbet-match-content',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BackButtonComponent,
    DatePipe,
    AsyncPipe,
    MatchHeaderComponent,
    MatchDetailsBaseComponent,
    MatchDetailsAfterComponent,
  ],
  styles: `
    :host { @apply flex flex-col gap-5; }
    .header { @apply flex items-center justify-between;}
    .date-label { @apply text-fb-font-size-body-2 mr-3; }
    section.data > *:not(futbet-match-header) { @apply border-b-[1px] my-10; }
  `,
  template: `
    <section class="header">
      <futbet-back-button />

      <span class="date-label">
        {{ data().fixture.date | date : 'HH:mm | dd.MM.yy' }}
      </span>
    </section>

    <section class="data">
      <futbet-match-header [data]="data()" />

      <futbet-match-details-base [data]="data()" />

      <!-- @switch(isUpcoming()) { @case(true) {
        <futbet-match-before-details />
        } @case(false) { -->
      <futbet-match-details-after [data]="(statistics() | async)!" />
      <!-- }} -->
    </section>
  `,
})
export class MatchContentComponent {
  data = input.required<MatchDTO>();

  fs = inject(FixtureStatisticsService);
  statistics = computed(() =>
    this.fs.requestFixtureStatistics(this.data().fixture.id)
  );
}
