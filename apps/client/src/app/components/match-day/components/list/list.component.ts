import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import { logoFromAssets } from '@lib/models';
import { OptimizedImageComponent } from '../../../../components';
import { CompetitionFixtures } from '../../../../models';
import { ShortTeamNamePipe } from '../../../../pipes';

@Component({
  selector: 'futbet-match-day-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, RouterModule, OptimizedImageComponent, ShortTeamNamePipe],
  styles: `
    :host {
      @apply flex flex-col overflow-hidden border;
      border-color: var(--mat-standard-button-toggle-divider-color);
      border-radius: var(--mat-standard-button-toggle-shape);
    }
    .header { @apply flex px-4 py-3 gap-3 bg-white border-b-[1px]; }
    .header span { @apply text-fb-font-size-body-1; }
    ul { @apply w-full text-fb-font-size-small; }
    li { @apply bg-white sm:hover:bg-fb-color-green-1-light cursor-pointer; }
    li:not(:last-of-type) { @apply border-b-[1px]; }
    li > section { @apply inline-flex flex-col; }
    .time { @apply min-w-[50px] py-[16.5px]; }
    .time, .result { @apply flex text-center leading-[16px]; }
    .result { 
      @apply align-middle px-2; 
      border-left: 1px solid var(--mat-standard-button-toggle-divider-color);
      border-right: 1px solid var(--mat-standard-button-toggle-divider-color);
    }
    .teams { @apply align-middle px-3; }
    .teams > div { @apply flex items-center gap-2; }
  `,
  template: `
    <div class="header">
      <futbet-optimized-image
        [source]="
          'assets/images/country/' +
          competition().fixtures[0].league.id +
          '.svg'
        "
        alternate="country flag"
        width="16"
        height="12"
      />
      <span>{{ competition().name }}</span>
    </div>
    <ul>
      @for(item of competition().fixtures; track item.league.id) {
      <li
        [routerLink]="['/', 'leagues', 'bundesliga', 'match', item.fixture.id]"
      >
        <section class="time">
          <span>{{ item.fixture.date | date : 'HH:mm' }}</span>
        </section>
        <section class="result">
          <span>{{ item.score.fulltime.home }}</span>
          <span>{{ item.score.fulltime.away }}</span>
        </section>
        <section class="teams">
          <div>
            <futbet-optimized-image
              [source]="logoFromAssets(item.teams.home.id)"
              alternate="home logo"
              width="12"
              height="12"
            />
            <span>{{ item.teams.home.name | shortTeamName }}</span>
          </div>
          <div>
            <futbet-optimized-image
              [source]="logoFromAssets(item.teams.away.id)"
              alternate="away logo"
              width="12"
              height="12"
            />
            <span>{{ item.teams.away.name | shortTeamName }}</span>
          </div>
        </section>
      </li>
      }
    </ul>
  `,
})
export class MatchDayListComponent {
  readonly competition = input.required<CompetitionFixtures>();

  logoFromAssets = logoFromAssets;
}
