import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
  untracked,
} from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';

import {
  DateService,
  WeekdayFixturesStore,
  WeekdayStandingsStore,
} from '@app/shared';

import { MatchesComponent, StandingsComponent } from './components';
import { HideHeaderDirective } from './directives';

@Component({
  selector: 'reelscore-start-tab-group',
  standalone: true,
  imports: [
    MatTabsModule,
    HideHeaderDirective,
    MatchesComponent,
    StandingsComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    section {
      @apply max-w-fb-max-width inline-flex flex-wrap md:flex-nowrap w-full gap-5 mx-auto;

      reelscore-matches, reelscore-standings {
        @apply w-full min-w-[200px];
      }
    }
  `,
  template: `
    <mat-tab-group
      [selectedIndex]="tabIndex()"
      dynamicHeight
      rsHideHeader
      animationDuration="280ms"
    >
      @for (weekday of weekdays; track $index; let idx = $index) {
      <mat-tab [label]="weekday">
        <section>
          @if (weekFixtures() && weekFixtures()![idx]) {
          <reelscore-matches
            [dayFixtures]="weekFixtures()![idx]"
            [isLoading]="weekFixturesStore.isLoading()"
            [error]="weekFixturesStore.error()"
          />
          } @if (weekStandings() && weekStandings()![idx]) {
          <reelscore-standings
            [weekStandings]="weekStandings()![idx]"
            [isLoading]="weekFixturesStore.isLoading()"
            [error]="weekFixturesStore.error()"
          />
          }
        </section>
      </mat-tab>
      }
    </mat-tab-group>
  `,
})
export class TabGroupComponent implements OnInit {
  dateService = inject(DateService);
  weekdays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
  selectedDay = this.dateService.selectedDay;
  tabIndex = this.dateService.selectedTabIndex;

  weekFixturesStore = inject(WeekdayFixturesStore);
  weekFixtures = this.weekFixturesStore.weekFixtures;
  weekStandingsStore = inject(WeekdayStandingsStore);
  weekStandings = this.weekStandingsStore.weekStandings;

  ngOnInit(): void {
    const date = this.selectedDay().split('T')[0];
    this.weekFixturesStore.loadWeekdayFixtures(date);
    this.weekStandingsStore.loadWeekdayStandings(date);
  }

  calenderWeekEffect = effect(
    () => {
      this.dateService.calenderWeek();
      const date = untracked(this.selectedDay).split('T')[0];
      this.weekFixturesStore.loadWeekdayFixtures(date);
      this.weekStandingsStore.loadWeekdayStandings(date);
    },
    { allowSignalWrites: true }
  );
}
