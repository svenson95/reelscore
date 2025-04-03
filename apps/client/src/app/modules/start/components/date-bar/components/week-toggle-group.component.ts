import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  Pipe,
  PipeTransform,
} from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import moment from 'moment';

import {
  DateString,
  TODAY_ISO_STRING,
  WeekdayFixturesStore,
  WeekdayStandingsStore,
} from '@app/shared';

@Pipe({
  name: 'isToday',
  standalone: true,
})
export class IsTodayPipe implements PipeTransform {
  transform(day: DateString): boolean {
    return day === TODAY_ISO_STRING;
  }
}

@Component({
  selector: 'reelscore-week-toogle-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    MatButtonToggleModule,
    MatIconModule,
    MatTooltipModule,
    IsTodayPipe,
  ],
  styles: `
    :host { @apply w-full xs:w-fit; touch-action: pan-x pan-y; }
    :host mat-button-toggle-group {
      --mat-standard-button-toggle-selected-state-text-color: var(--rs-color-white);
      --mat-standard-button-toggle-selected-state-background-color: var(--rs-color-orange);
      --mat-standard-button-toggle-disabled-selected-state-text-color: var(--rs-color-white);
      --mat-standard-button-toggle-disabled-selected-state-background-color: var(--rs-color-orange);
      --mat-standard-button-toggle-height: 34px; 
      @apply flex;

      mat-button-toggle.mat-button-toggle {
        @apply flex-1 text-rs-font-size-body-2 border-l-0;

        &.is-today {
          --mat-standard-button-toggle-background-color: var(--rs-color-white-2);
        }

        &.mat-button-toggle-appearance-standard ::ng-deep {
          .mat-button-toggle-label-content {
            min-width: 36px;
            padding: 0 8px;
          }

          &:first-of-type, &:last-of-type {
            .mat-button-toggle-label-content {
              padding: 0 2px;
            }
          }
        }
      }

      .mat-button-toggle-checked {
        @apply font-bold;
      }
    }
  `,
  template: `
    <mat-button-toggle-group
      hideSingleSelectionIndicator
      [value]="selectedDay()"
    >
      <mat-button-toggle
        [disabled]="isLoading()"
        (click)="setDateTo(-1)"
        matTooltip="Vorheriger Tag"
      >
        <mat-icon>keyboard_arrow_left</mat-icon>
      </mat-button-toggle>
      @for(date of indexedWeekdays(); track date.index) {
      <mat-button-toggle
        [disabled]="isLoading()"
        [value]="date.day"
        (click)="dateSelected.emit(date.day)"
        [class.is-today]="date.day | isToday"
      >
        {{ date.day | date : 'ccc' }}
      </mat-button-toggle>
      }
      <mat-button-toggle
        [disabled]="isLoading()"
        (click)="setDateTo(+1)"
        matTooltip="Nächster Tag"
      >
        <mat-icon>keyboard_arrow_right</mat-icon>
      </mat-button-toggle>
    </mat-button-toggle-group>
  `,
})
export class WeekToggleGroupComponent {
  selectedDay = input.required<DateString>();
  weekdays = input.required<DateString[]>();
  indexedWeekdays = computed<{ day: DateString; index: number }[]>(() =>
    this.weekdays().map((day) => ({ day, index: new Date(day).getDate() }))
  );

  dateSelected = output<DateString>();

  weekFixtures = inject(WeekdayFixturesStore);
  weekStandings = inject(WeekdayStandingsStore);
  isLoading = computed<boolean>(
    () => this.weekFixtures.isLoading() || this.weekStandings.isLoading()
  );

  setDateTo(value: number): void {
    const date = new Date(this.selectedDay());
    date.setDate(date.getDate() + value);
    const formattedDate = moment(date).tz('Europe/Berlin').format('YYYY-MM-DD');
    this.dateSelected.emit(formattedDate);
  }
}
