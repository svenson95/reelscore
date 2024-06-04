import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { LatestFixturesDTO } from '@lib/models';

import { MatchFixturesTableComponent } from './fixtures-table.component';

@Component({
  selector: 'futbet-match-latest-fixtures',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatchFixturesTableComponent],
  styles: `
    :host { @apply flex flex-col gap-3; }
    div { @apply flex gap-5 flex-col md:flex-row; }
  `,
  template: `
    <h3 class="match-section-title">LETZTE SPIELE</h3>
    <div>
      <futbet-match-fixtures-table [latestFixtures]="latestFixtures().home" />
      <futbet-match-fixtures-table [latestFixtures]="latestFixtures().away" />
    </div>
  `,
})
export class MatchLatestFixturesComponent {
  latestFixtures = input.required<LatestFixturesDTO>();
}
