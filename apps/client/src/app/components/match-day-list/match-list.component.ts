import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

import { COMPETITION_EXAMPLES, Competition } from '../../models';

@Component({
  selector: 'futbet-start-match-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule],
  styles: `
    .list-header { @apply flex p-3 gap-3 bg-white border-b-[1px]; }
    ul { @apply w-full; }
    li { @apply bg-white hover:bg-fb-color-green-1-light cursor-pointer border-b-[1px]; }
    .wrapper { @apply flex text-fb-font-size-body-2; }
    .state { @apply min-w-[75px] justify-center; }
    .result { @apply min-w-[50px] justify-center; }
    .state, .result { @apply flex self-center bg-gray-50 px-4 py-5; }
    .teams { @apply self-center px-4 py-2; }
  `,
  template: `
    <div class="list-header">
      <span>{{ competition().flag }}</span>
      <h5>{{ competition().name }}</h5>
    </div>
    <ul>
      @for(item of competition().list; track item.id){
      <li [routerLink]="['leagues', 'bundesliga', 'match', item.id]">
        <div class="wrapper">
          <div class="state">
            @switch (item.state) { @case ("upcoming") { 15:30 } @case
            ("finished") { FT } }
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
      } @empty {
      <div class="is-empty">Es finden keine Spiele statt.</div>
      }
    </ul>
  `,
})
export class MatchListComponent {
  readonly competition = signal<Competition>(COMPETITION_EXAMPLES[0]);
}
