import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { of, switchMap } from 'rxjs';

import { FixtureStatisticsService, FixturesService } from '@app/services';
import { LatestFixturesDTO } from '@lib/models';
import { MatchFixturesTableComponent } from './fixtures-table.component';

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
  fss = inject(FixtureStatisticsService);
  fixtureId = this.fss.fixtureId;

  latestFixtures = toSignal<LatestFixturesDTO | null>(
    toObservable(this.fixtureId).pipe(
      switchMap((id) => (id ? this.fs.loadLatestFixtures(id) : of(null)))
    )
  );
}
