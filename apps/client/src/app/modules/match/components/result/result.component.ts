import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { MatchDTO } from '@lib/models';

import { OptimizedImageComponent } from '../../../../components';

@Component({
  selector: 'futbet-match-result',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OptimizedImageComponent, DatePipe],
  styles: `
    :host { @apply flex flex-col; }
    section { @apply w-full self-center; }
    section.details { @apply flex items-center; }
    section.details div { @apply flex flex-1 gap-2 items-center justify-center; }
    section.details div.team-column { @apply gap-5; }
    section.details div:not(.team-column) { @apply gap-2; }
    section.date div { @apply flex w-full gap-3 items-center leading-[20px]; }
    .team-name { @apply text-fb-font-size-body-1 leading-[18px]; }
    .date-label { @apply flex-1 text-fb-font-size-body-2; }
  `,
  template: `
    <section class="date">
      <div>
        <span class="date-label text-right">
          {{ data().fixture.date | date : 'dd.MM.yyyy' }}
        </span>
        <span class="date-label">
          {{ data().fixture.date | date : 'HH:mm' }}
        </span>
      </div>
    </section>

    <section class="details">
      <div class="team-column">
        <futbet-optimized-image
          [source]="data().teams.home.logo"
          alternate="home logo"
          width="50"
          height="50"
        />
        <span class="team-name">{{ data().teams.home.name }}</span>
      </div>

      <div>
        @switch(isUpcoming()) { @case(true) {
        <span>{{ data().score.fulltime.home }}</span>
        <span>:</span>
        <span>{{ data().score.fulltime.away }}</span>
        } @case(false) { }}
      </div>

      <div class="team-column">
        <span class="team-name text-right">{{ data().teams.away.name }}</span>
        <futbet-optimized-image
          [source]="data().teams.away.logo"
          alternate="away logo"
          width="50"
          height="50"
        />
      </div>
    </section>
  `,
})
export class MatchResultComponent {
  isUpcoming = input.required<boolean>();
  data = input.required<MatchDTO>();
}
