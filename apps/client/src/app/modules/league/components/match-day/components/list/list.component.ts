import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import { OptimizedImageComponent } from '../../../../../../components';
import { CompetitionFixtures } from '../../../../../../models';

@Component({
  selector: 'futbet-league-match-day-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule, OptimizedImageComponent],
  styles: `
    .list-header { @apply flex p-3 gap-3 bg-white border-b-[1px]; }
    ul { @apply w-full; }
    li { @apply bg-white hover:bg-fb-color-green-1-light cursor-pointer border-b-[1px]; }
    .wrapper { @apply flex text-fb-font-size-body-2; }
    .time, .result { @apply flex self-center bg-gray-50 px-4 py-5; }
    .time { @apply min-w-[75px] justify-center; }
    .result { @apply min-w-[50px] justify-center; }
    .teams { @apply self-center px-4 py-2; }
  `,
  template: `
    <div class="list-header">
      <futbet-optimized-image [source]="competition().image" />
      <h5>{{ competition().name }}</h5>
    </div>
    <ul>
      @for(item of competition().fixtures; track item.id){
      <li [routerLink]="['/', 'leagues', 'bundesliga', 'match', item.id]">
        <div class="wrapper">
          <div class="time">
            {{ item.date | date : 'HH:mm' }}
          </div>
          <div class="result">
            {{ item.result?.full_time ?? '-' }}
          </div>
          <div class="teams">
            <div class="home-team">{{ item.homeTeam }}</div>
            <div class="away-team">{{ item.awayTeam }}</div>
          </div>
        </div>
      </li>
      }
    </ul>
  `,
})
export class MatchDayListComponent {
  readonly competition = input.required<CompetitionFixtures>();
}
