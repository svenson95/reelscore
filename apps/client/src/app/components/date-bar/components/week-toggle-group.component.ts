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

import { DateString, TODAY_ISO_STRING } from '../../../models';

// TODO: refactor to lib?
@Component({
  selector: 'futbet-week-toogle-group',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, MatButtonToggleModule, MatIconModule, MatTooltipModule],
  styles: `
    :host mat-button-toggle-group {
      --mat-standard-button-toggle-selected-state-text-color: var(--fb-color-white);
      --mat-standard-button-toggle-selected-state-background-color: var(--fb-color-green-1); 

      mat-button-toggle.mat-button-toggle {
        @apply text-fb-font-size-body-2;

        &.is-today {
          --mat-standard-button-toggle-background-color: var(--fb-color-white);
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
    }
  `,
  template: `
    <mat-button-toggle-group
      hideSingleSelectionIndicator
      [value]="selectedDay()"
    >
      <mat-button-toggle (click)="setDateTo(-1)" matTooltip="Zurück">
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
      <mat-button-toggle (click)="setDateTo(+1)" matTooltip="Weiter">
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
    this.dateSelected.emit(date.toISOString());
  }
}
