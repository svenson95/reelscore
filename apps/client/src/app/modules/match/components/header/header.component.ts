import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';

import { OptimizedImageComponent } from '@app/components';
import { TeamNamePipe } from '@app/pipes';
import { FixtureDTO, logoFromAssets } from '@lib/models';

@Component({
  selector: 'futbet-match-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OptimizedImageComponent, DatePipe, TeamNamePipe],
  styles: `
    :host { 
      @apply flex bg-white p-8 border-[1px] rounded-fb; 
    }
    div { @apply flex gap-2 items-center justify-center text-fb-font-size-body-2 sm:text-fb-font-size-body-1; }
    .team-column { @apply flex-[2] flex-col gap-3; }
    .result-column { @apply flex-1 gap-1; }
    .team-name { @apply leading-[16px] text-center; }
  `,
  template: `
    <div class="team-column">
      <futbet-optimized-image
        [source]="logoFromAssets(data().teams.home.id)"
        alternate="home logo"
        width="50"
        height="50"
      />
      <span class="team-name">
        {{ data().teams.home.name | teamName }}
      </span>
    </div>

    <div class="result-column">
      @switch(isUpcoming()) { @case(true) {
      <span>{{ data().score.fulltime.home }}</span>
      <span>:</span>
      <span>{{ data().score.fulltime.away }}</span>
      } @case(false) { }}
    </div>

    <div class="team-column">
      <futbet-optimized-image
        [source]="logoFromAssets(data().teams.away.id)"
        alternate="away logo"
        width="50"
        height="50"
      />
      <span class="team-name">
        {{ data().teams.away.name | teamName }}
      </span>
    </div>
  `,
})
export class MatchHeaderComponent {
  data = input.required<FixtureDTO>();
  isUpcoming = signal<boolean>(true); // TODO derive value from fixture date

  logoFromAssets = logoFromAssets;
}
