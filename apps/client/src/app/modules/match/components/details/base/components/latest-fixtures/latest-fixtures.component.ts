import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { FixturesService } from '../../../../../services';
import { MatchFixturesTableComponent } from './components';

@Component({
  selector: 'futbet-match-latest-fixtures',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatProgressSpinnerModule, MatchFixturesTableComponent],
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
      @defer() { @if (latestFixtures(); as match) {
      <futbet-match-fixtures-table [latestFixtures]="match.home" />
      <futbet-match-fixtures-table [latestFixtures]="match.away" />
      } @else {
      <mat-spinner class="my-20 mx-auto" diameter="20" />
      }}
    </section>
  `,
})
export class MatchLatestFixturesComponent {
  fs = inject(FixturesService);

  latestFixtures = this.fs.latestFixtures;
}
