import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import { OptimizedImageComponent } from '../../../../../../components';
import { CompetitionFixtures } from '../../../../../../models';

@Component({
  selector: 'futbet-league-match-day-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, RouterModule, OptimizedImageComponent],
  styles: `
    .header { @apply flex px-4 py-3 gap-3 bg-white border-b-[1px]; }
    .header span { @apply text-fb-font-size-body-1; }
    ul { @apply text-fb-font-size-small; }
    li { @apply bg-white hover:bg-fb-color-green-1-light cursor-pointer border-b-[1px]; }
    li > div { @apply inline-flex flex-col; }
    .time, .result { @apply min-w-[56px] flex text-center py-[16.5px] leading-[16px]; }
    .result { @apply tracking-[0.2em]; }
    .teams { @apply align-middle px-3; }
  `,
  template: `
    <div class="header">
      <futbet-optimized-image
        [source]="competition().image"
        alternate="country flag"
        width="16"
        height="12"
      />
      <span>{{ competition().name }}</span>
    </div>
    <ul>
      @for(item of competition().fixtures; track item.id){
      <li [routerLink]="['/', 'leagues', 'bundesliga', 'match', item.id]">
        <div class="time">
          <span>{{ item.date | date : 'HH:mm' }}</span>
        </div>
        <div class="result">
          <span>{{ item.result?.full_time ?? '-' }}</span>
        </div>
        <div class="teams">
          <span>{{ item.homeTeam }}</span>
          <span>{{ item.awayTeam }}</span>
        </div>
      </li>
      }
    </ul>
  `,
})
export class MatchDayListComponent {
  readonly competition = input.required<CompetitionFixtures>();
}
