import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { MatchDTO } from '@lib/models';

import { BackButtonComponent } from '../../../../components';
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
    DatePipe,
    MatButtonModule,
    MatchHeaderComponent,
    MatchDetailsBaseComponent,
    MatchDetailsAfterComponent,
  ],
  styles: `
    :host { @apply flex flex-col gap-10; }
    .header { @apply flex items-center justify-between border-b-[1px] pb-2;}
    .dates { @apply flex gap-2; }
    section.data { @apply flex flex-col gap-10; }
  `,
  template: `
    <section class="header">
      <futbet-back-button />

      <div class="dates">
        <button mat-stroked-button disabled>
          {{ data().fixture.date | date : 'HH:mm' }}
        </button>
        <button mat-stroked-button disabled>
          {{ data().fixture.date | date : 'dd.MM.yy' }}
        </button>
      </div>
    </section>

    <section class="data">
      <futbet-match-header [data]="data()" />

      <futbet-match-details-base [data]="data()" />

      @switch(isUpcoming()) { @case(true) {
      <!-- <futbet-match-before-details /> -->
      } @case(false) {
      <futbet-match-details-after [fixtureId]="data().fixture.id" />
      }}
    </section>
  `,
})
export class MatchContentComponent {
  data = input.required<MatchDTO>();
  isUpcoming = signal<boolean>(false); // TODO derive value from fixture date
}
