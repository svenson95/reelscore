import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
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
    MatIconModule,
    MatButtonModule,
  ],
  styles: `
    :host { 
      @apply w-full flex flex-wrap items-center justify-between mb-5 gap-5; 

      .search-button ::ng-deep .mat-mdc-button-persistent-ripple { 
        @apply rounded-[0];
      }
    }
    mat-spinner { --mdc-circular-progress-active-indicator-color: var(--fb-color-white); }
    
    .top { @apply flex w-full sm:w-fit items-center gap-5; }
    .spacer { @apply flex-grow; }
    .search-button { 
      --mdc-icon-button-state-layer-size: 36px;
      @apply bg-fb-color-white p-[2px] rounded-[0];
      
      .mat-icon { @apply w-[20px] h-[20px] text-[20px]; }
    }
  `,
  template: `
    <div class="top">
      <reelscore-date-picker
        [selectedDay]="selectedDay()"
        (dateSelected)="selectedDay.set($event)"
      />
      @if (isMobile()){
      <div class="week-and-time">
        <reelscore-today-button
          [isToday]="isToday()"
          (onClick)="selectedDay.set($event)"
        />
      </div>
      @if (isLoading()) {
      <mat-spinner diameter="20"></mat-spinner>}
      <div class="spacer"></div>
      <button class="search-button" mat-icon-button aria-label="Search button">
        <mat-icon>search</mat-icon>
      </button>
      }
    </div>

    <reelscore-week-toogle-group
      [weekdays]="weekdays()"
      [selectedDay]="selectedDay()"
      (dateSelected)="selectedDay.set($event)"
    />

    @if (!isMobile()){
    <div class="week-and-time">
      <reelscore-today-button
        [isToday]="isToday()"
        (onClick)="selectedDay.set($event)"
      />
    </div>
    @if (isLoading()) {
    <mat-spinner diameter="20"></mat-spinner>}
    <div class="spacer"></div>
    <button class="search-button" mat-icon-button aria-label="Search button">
      <mat-icon>search</mat-icon>
    </button>
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
