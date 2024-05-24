import { AsyncPipe, NgIf } from '@angular/common';
import { Component, computed, inject } from '@angular/core';

import { DateBarComponent } from '../../components';
import {
  DateService,
  HttpFixturesService,
  ROUTE_SERVICE_PROVIDER,
} from '../../services';
import { RouterView } from '../router-view';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatchDayComponent, StandingsComponent } from './components';

@Component({
  selector: 'futbet-league',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    MatProgressSpinnerModule,
    DateBarComponent,
    MatchDayComponent,
    StandingsComponent,
  ],
  providers: [ROUTE_SERVICE_PROVIDER],
  styles: `
    :host { 
      @apply w-full; 

      section {
        @apply inline-flex flex-wrap md:flex-nowrap w-full gap-5;

        futbet-league-match-day, futbet-league-standings {
          @apply w-full min-w-[200px];
        }
      }
    }
  `,
  template: `
    <futbet-start-date-bar />

    <section>
      <futbet-league-match-day
        *ngIf="fixtures$() | async as fixtures; else loading"
        [fixtureData]="fixtures"
      />

      <ng-template #loading>
        <div class="w-full">
          <mat-spinner class="my-10 mx-auto" diameter="20" />
        </div>
      </ng-template>

      <futbet-league-standings />
    </section>
  `,
})
export class LeagueComponent extends RouterView {
  httpFixtures = inject(HttpFixturesService);
  date = inject(DateService);

  fixtures$ = computed(() => {
    const d = new Date(this.date.selectedDay());
    const date = new Date(d.setDate(d.getDate() + 1)).toISOString();
    const dateString = date.split('T')[0];
    return this.httpFixtures.getFixtures(dateString);
  });
}
