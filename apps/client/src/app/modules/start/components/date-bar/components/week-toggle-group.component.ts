import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { DateString, TODAY_ISO_STRING, toIsoString } from '@app/shared';

@Component({
  selector: 'reelscore-week-toogle-group',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, MatButtonToggleModule, MatIconModule, MatTooltipModule],
  styles: `
    :host { @apply w-full xs:w-fit; touch-action: pan-x pan-y; }
    :host mat-button-toggle-group {
      --mat-standard-button-toggle-selected-state-text-color: white; // TODO refactor white var to -1 and -2
      --mat-standard-button-toggle-selected-state-background-color: var(--fb-color-red);
      --mat-standard-button-toggle-height: 34px; 
      @apply flex;

      mat-button-toggle.mat-button-toggle {
        @apply flex-1 text-fb-font-size-body-2 border-l-0;

        &.is-today {
          --mat-standard-button-toggle-background-color: var(--fb-color-white-2);
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
      <mat-button-toggle (click)="setDateTo(-1)" matTooltip="Vorheriger Tag">
        <mat-icon>keyboard_arrow_left</mat-icon>
      </mat-button-toggle>
      @for(day of weekdays(); track day) {
      <mat-button-toggle
        [value]="day"
        (click)="dateSelected.emit(day)"
        [class.is-today]="isToday(day)"
      >
        {{ day | date : 'ccc' }}
      </mat-button-toggle>
      }
      <mat-button-toggle (click)="setDateTo(+1)" matTooltip="Nächster Tag">
        <mat-icon>keyboard_arrow_right</mat-icon>
      </mat-button-toggle>
    </mat-button-toggle-group>
  `,
})
export class WeekToggleGroupComponent {
  selectedDay = input.required<DateString>();
  weekdays = input.required<DateString[]>();

  dateSelected = output<DateString>();

  isToday(day: DateString): boolean {
    return day === TODAY_ISO_STRING;
  }

  setDateTo(value: number): void {
    const date = new Date(this.selectedDay());
    date.setDate(date.getDate() + value);
    const formattedDate = toIsoString(date);
    this.dateSelected.emit(formattedDate);
  }
}
