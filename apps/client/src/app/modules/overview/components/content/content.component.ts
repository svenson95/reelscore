import {
  ChangeDetectionStrategy,
  Component,
  effect,
  HostListener,
  inject,
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
  selector: 'section[rs-overview-content]',
  imports: [
    MatTabsModule,
    HideHeaderDirective,
    MatchesComponent,
    StandingsComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .tab-content {
      @apply max-w-rs-max-width inline-flex flex-wrap md:flex-nowrap w-full p-5 gap-5 mx-auto;

      rs-matches, rs-standings {
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
        <div class="tab-content">
          @if (weekFixtures() && weekFixtures()![idx]) {
          <rs-matches
            [dayFixtures]="weekFixtures()![idx]"
            [isLoading]="weekFixturesStore.isLoading()"
            [error]="weekFixturesStore.error()"
          />
          } @if (weekStandings() && weekStandings()![idx]) {
          <rs-standings
            [weekStandings]="weekStandings()![idx]"
            [isLoading]="weekStandingsStore.isLoading()"
            [error]="weekStandingsStore.error()"
          />
          }
        </div>
      </mat-tab>
      }
    </mat-tab-group>
  `,
})
export class OverviewContentComponent {
  dateService = inject(DateService);
  weekdays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
  selectedDay = this.dateService.selectedDay;
  tabIndex = this.dateService.selectedTabIndex;

  weekFixturesStore = inject(WeekdayFixturesStore);
  weekFixtures = this.weekFixturesStore.weekFixtures;
  weekStandingsStore = inject(WeekdayStandingsStore);
  weekStandings = this.weekStandingsStore.weekStandings;

  calenderWeekEffect = effect(() => {
    this.dateService.calenderWeek();
    const date = untracked(this.selectedDay).split('T')[0];
    this.weekFixturesStore.loadWeekdayFixtures(date);
    this.weekStandingsStore.loadWeekdayStandings(date);
  });

  @HostListener('document:visibilitychange', ['$event'])
  onVisibilityChange(): void {
    const isStartRoute = /^\/\d{4}-\d{2}-\d{2}$/.test(location.pathname);
    if (!document.hidden && isStartRoute) {
      const date = untracked(this.selectedDay).split('T')[0];
      this.weekFixturesStore.loadWeekdayFixtures(date, true);
      this.weekStandingsStore.loadWeekdayStandings(date, true);
    }
  }
}
