import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Store } from '@ngrx/store';

import { BreakpointObserverService, DateService } from '@app/services';
import { selectStandings } from '../../../../store';
import {
  DatePickerComponent,
  TodayButtonComponent,
  WeekToggleGroupComponent,
} from './components';

@Component({
  selector: 'reelscore-date-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePickerComponent,
    TodayButtonComponent,
    WeekToggleGroupComponent,
    MatProgressSpinnerModule,
  ],
  styles: `
    :host { 
      @apply flex flex-wrap items-center justify-between mb-5 gap-3 sm:gap-5; 
    }

    section { 
      @apply inline-flex flex-wrap items-center justify-center sm:w-fit gap-5; 
    }
      
    div { @apply flex gap-5 items-center; }
    .top { @apply w-full xs:w-fit justify-between; }
    mat-spinner { --mdc-circular-progress-active-indicator-color: var(--fb-color-white); }
  `,
  template: `
    <section>
      <div class="top">
        <reelscore-date-picker
          [selectedDay]="selectedDay()"
          (dateSelected)="selectedDay.set($event)"
        />

        @if (isMobile()) {
        <div class="week-and-time">
          <reelscore-today-button
            [isToday]="isToday()"
            (onClick)="selectedDay.set($event)"
          />
        </div>
        }
      </div>

      <reelscore-week-toogle-group
        [weekdays]="weekdays()"
        [selectedDay]="selectedDay()"
        (dateSelected)="selectedDay.set($event)"
      />

      @if (isLoading()) { <mat-spinner diameter="24"></mat-spinner>}
    </section>

    @if (!isMobile()) {
    <reelscore-today-button
      [isToday]="isToday()"
      (onClick)="selectedDay.set($event)"
    />
    }
  `,
})
export class DateBarComponent {
  bos = inject(BreakpointObserverService);
  ds = inject(DateService);
  store = inject(Store);

  selectedDay = this.ds.selectedDay;
  weekdays = this.ds.weekdays;
  calenderWeek = this.ds.calenderWeek;
  isToday = this.ds.isToday;

  isMobile = this.bos.isMobile;

  standings = toSignal(this.store.select(selectStandings));
  isLoading = computed(() => this.standings()?.isLoading);
}
