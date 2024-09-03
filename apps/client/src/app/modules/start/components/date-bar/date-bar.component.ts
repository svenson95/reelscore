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
  ActionButtonsComponent,
  DatePickerComponent,
  TodayButtonComponent,
  WeekToggleGroupComponent,
} from './components';

@Component({
  selector: 'reelscore-date-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatProgressSpinnerModule,
    DatePickerComponent,
    TodayButtonComponent,
    WeekToggleGroupComponent,
    ActionButtonsComponent,
  ],
  styles: `
    :host { @apply w-full flex flex-wrap items-center justify-between mb-5 gap-5; }
    mat-spinner { --mdc-circular-progress-active-indicator-color: var(--fb-color-white); }
    .top { @apply flex w-full sm:w-fit items-center gap-5; }
    .spacer { @apply flex-grow; }
  `,
  template: `
    <div class="top">
      <reelscore-date-picker
        [selectedDay]="selectedDay()"
        (dateSelected)="selectedDay.set($event)"
      />
      @if (isMobile()){
      <reelscore-today-button
        [isToday]="isToday()"
        (onClick)="selectedDay.set($event)"
      />
      @if (isLoading()) {
      <mat-spinner diameter="20"></mat-spinner>}
      <div class="spacer"></div>
      <reelscore-action-buttons />
      }
    </div>

    <reelscore-week-toogle-group
      [weekdays]="weekdays()"
      [selectedDay]="selectedDay()"
      (dateSelected)="selectedDay.set($event)"
    />

    @if (!isMobile()){
    <reelscore-today-button
      [isToday]="isToday()"
      (onClick)="selectedDay.set($event)"
    />
    @if (isLoading()) {
    <mat-spinner diameter="20"></mat-spinner>}
    <div class="spacer"></div>
    <reelscore-action-buttons />
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
