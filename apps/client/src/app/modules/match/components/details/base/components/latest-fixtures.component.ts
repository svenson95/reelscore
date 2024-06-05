import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { LatestFixturesDTO } from '@lib/models';

import { MatchFixturesTableComponent } from './fixtures-table.component';

@Component({
  selector: 'futbet-match-latest-fixtures',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatchFixturesTableComponent],
  styles: `
    :host { @apply flex flex-col bg-white border-[1px] rounded-fb; }
    section { @apply flex flex-col md:flex-row; }
    futbet-match-fixtures-table:first-of-type {
      @apply border-b-[1px] md:border-b-0 md:border-r-[1px]; 
    }
  `,
  template: `
    <h3 class="match-section-title">LETZTE SPIELE</h3>
    <section>
      <futbet-match-fixtures-table [latestFixtures]="latestFixtures().home" />
      <futbet-match-fixtures-table [latestFixtures]="latestFixtures().away" />
    </section>
  `,
})
export class MatchLatestFixturesComponent {
  latestFixtures = input.required<LatestFixturesDTO>();
}
