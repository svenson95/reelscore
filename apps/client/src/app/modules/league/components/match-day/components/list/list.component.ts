import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CompetitionFixtures } from '../../../../../..//models';
import { OptimizedImageComponent } from '../../../../../../components';

@Component({
  selector: 'futbet-league-match-day-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, RouterModule, OptimizedImageComponent],
  styles: `
    :host {
      @apply flex flex-col overflow-hidden border;
      border-color: var(--mat-standard-button-toggle-divider-color);
      border-radius: var(--mat-standard-button-toggle-shape);
    }
    .header { @apply flex px-4 py-3 gap-3 bg-white border-b-[1px]; }
    .header span { @apply text-fb-font-size-body-1; }
    ul { @apply w-full text-fb-font-size-small; }
    li { @apply bg-white hover:bg-fb-color-green-1-light cursor-pointer; }
    li:not(:last-of-type) { @apply border-b-[1px]; }
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
      @for(item of competition().fixtures; track item.league.id) {
      <li
        [routerLink]="['/', 'leagues', 'bundesliga', 'match', item.league.id]"
      >
        <div class="time">
          <span>{{ item.fixture.date | date : 'HH:mm' }}</span>
        </div>
        <div class="result">
          @if (item.score.fulltime.home === null) { "-" } @else {
          <span
            >{{ item.score.fulltime.home }} -
            {{ item.score.fulltime.away }}</span
          >
          }
        </div>
        <div class="teams">
          <span>{{ item.teams.home.name }}</span>
          <span>{{ item.teams.away.name }}</span>
        </div>
      </li>
      }
    </ul>
  `,
})
export class MatchDayListComponent {
  readonly competition = input.required<CompetitionFixtures>();
}
