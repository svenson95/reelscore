import { DatePipe, NgIf } from '@angular/common';
import { Component, effect, inject, input, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { switchMap } from 'rxjs';

import { BackButtonComponent } from '@app/components';
import {
  FixtureStatisticsService,
  FixturesService,
  ROUTE_SERVICE_PROVIDER,
} from '@app/services';
import { FixtureId } from '@lib/models';
import { RouterView } from '../router-view';
import {
  MatchDetailsAfterComponent,
  MatchDetailsBaseComponent,
  MatchHeaderComponent,
} from './components';

@Component({
  selector: 'futbet-match',
  standalone: true,
  imports: [
    NgIf,
    DatePipe,
    MatButtonModule,
    BackButtonComponent,
    MatchHeaderComponent,
    MatchDetailsBaseComponent,
    MatchDetailsAfterComponent,
  ],
  providers: [ROUTE_SERVICE_PROVIDER],
  styles: `
    :host { @apply w-full flex flex-col gap-5; }
    .header { @apply flex items-center justify-between;}
    .dates { @apply flex gap-2; }
    section.data { @apply max-w-fb-max-width w-full flex flex-col gap-10 mx-auto; }
    button { @apply fb-as-label; }
  `,
  template: `
    <ng-container *ngIf="fixture() as match">
      <section class="header">
        <futbet-back-button />

        <div class="dates">
          <button mat-stroked-button disabled>
            {{ match.fixture.date | date : 'ccc' }}
          </button>
          <button mat-stroked-button disabled>
            {{ match.fixture.date | date : 'HH:mm' }}
          </button>
          <button mat-stroked-button disabled>
            {{ match.fixture.date | date : 'dd.MM.yy' }}
          </button>
        </div>
      </section>

      <section class="data">
        <futbet-match-header [data]="match" />
        <futbet-match-details-base [data]="match" />

        @switch(isUpcoming()) { @case(true) {
        <!-- <futbet-match-details-before /> -->
        } @case(false) {
        <futbet-match-details-after [fixtureId]="match.fixture.id" />
        }}
      </section>
    </ng-container>
  `,
})
export class MatchComponent extends RouterView {
  fixtureId = input.required<FixtureId>();
  fss = inject(FixtureStatisticsService);
  fs = inject(FixturesService);

  isUpcoming = signal<boolean>(false); // TODO derive value from fixture date

  fixture = toSignal(
    toObservable(this.fixtureId).pipe(
      switchMap((id) => this.fs.loadFixture(id))
    )
  );

  setFixtureId = effect(
    () => {
      this.fss.fixtureId.set(this.fixtureId());
    },
    { allowSignalWrites: true }
  );
}
