import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';

import { MatchDTO } from '@lib/models';

import { BackButtonComponent } from '../../../../components';
import { FixtureStatisticsService } from '../../../../services';

import {
  MatchDetailsAfterComponent,
  MatchDetailsBaseComponent,
  MatchHeaderComponent,
} from '../../components';

@Component({
  selector: 'futbet-match-content',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BackButtonComponent,
    NgIf,
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
    section.data { @apply flex flex-col gap-10; }
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

      @switch(isUpcoming()) { @case(true) {
      <!-- <futbet-match-before-details /> -->
      } @case(false) {
      <futbet-match-details-after
        *ngIf="statistics() | async as statistics"
        [statistics]="statistics"
      />
      }}
    </section>
  `,
})
export class MatchContentComponent {
  data = input.required<MatchDTO>();
  isUpcoming = signal<boolean>(false); // TODO derive value from fixture date

  fs = inject(FixtureStatisticsService);
  statistics = computed(() =>
    this.fs.requestFixtureStatistics(this.data().fixture.id)
  );
}
