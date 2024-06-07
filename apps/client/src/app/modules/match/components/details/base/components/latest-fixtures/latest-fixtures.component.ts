import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { FixturesService } from '../../../../../services';
import { MatchFixturesTableComponent } from './components';

@Component({
  selector: 'futbet-match-latest-fixtures',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf, MatProgressSpinnerModule, MatchFixturesTableComponent],
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
      <futbet-match-fixtures-table
        *ngIf="latestFixtures() as match; else loading"
        [latestFixtures]="match.home"
      />
      <futbet-match-fixtures-table
        *ngIf="latestFixtures() as match; else loading"
        [latestFixtures]="match.away"
      />
      <ng-template #loading>
        <mat-spinner class="my-20 mx-auto" diameter="20" />
      </ng-template>
    </section>
  `,
})
export class MatchLatestFixturesComponent {
  fs = inject(FixturesService);

  latestFixtures = this.fs.latestFixtures;
}
