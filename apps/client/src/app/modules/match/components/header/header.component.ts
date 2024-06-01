import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';

import { MatchDTO } from '@lib/models';

import { OptimizedImageComponent } from '../../../../components';

@Component({
  selector: 'futbet-match-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OptimizedImageComponent, DatePipe],
  styles: `
    :host { @apply flex; }
    div { @apply flex flex-1 gap-2 items-center justify-center text-fb-font-size-body-2 sm:text-fb-font-size-body-1; }
    .team-column { @apply gap-3; }
    .result-column { @apply gap-2; }
    .team-name { @apply leading-[14px]; }
  `,
  template: `
    <div class="team-column">
      <futbet-optimized-image
        [source]="data().teams.home.logo"
        alternate="home logo"
        width="50"
        height="50"
      />
      <span class="team-name">{{ data().teams.home.name }}</span>
    </div>

    <div class="result-column">
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
  `,
})
export class MatchHeaderComponent {
  data = input.required<MatchDTO>();
  isUpcoming = signal<boolean>(true); // TODO derive value from fixture date
}
