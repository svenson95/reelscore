import { DatePipe } from '@angular/common';
import type { PipeTransform } from '@angular/core';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  Pipe,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import type { CalendarWeek, DateString } from '@lib/shared';
import { formatDateToYearMonthDay } from '@lib/shared';

import { DateService } from '../../../services';

@Pipe({ name: 'isToday' })
export class IsTodayPipe implements PipeTransform {
  dateService = inject(DateService);
  transform = (day: DateString): boolean => day === this.dateService.today();
}

const EXTERNAL_MODULES = [
  DatePipe,
  MatButtonModule,
  MatButtonToggleModule,
  MatIconModule,
  MatTooltipModule,
];

@Component({
  selector: 'rs-week-toggle-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [...EXTERNAL_MODULES, IsTodayPipe],
  styles: `
    @use "@angular/material" as mat;

    :host {
      @apply w-full xs:w-fit;
      touch-action: pan-x pan-y;
    }

    .week-toggle-wrapper {
      @apply flex items-center w-full xs:w-fit;
    }

    mat-button-toggle-group.mat-button-toggle-group {
      @include mat.button-toggle-overrides(
        (
          height: 36px,
          label-text-size: var(--rs-font-size-body-2),
          text-color: var(--rs-color-primary),
          selected-state-text-color: var(--rs-color-text-3),
          disabled-state-text-color: var(--rs-border-color-2),
          disabled-selected-state-text-color: var(--rs-color-text-3),
          selected-state-background-color: var(--rs-color-primary),
          disabled-state-background-color: var(--rs-button-bg-color),
          disabled-selected-state-background-color: var(--rs-color-primary),
        )
      );

      @apply flex border-none flex-1 mx-px overflow-visible;

      mat-button-toggle.mat-button-toggle {
        @apply flex-1 shadow-rs3;
        border: none;

        &.is-today ::ng-deep .mat-button-toggle-label-content {
          @apply underline decoration-solid;
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

        .mat-icon {
          color: inherit;
        }
      }
    }
  `,
  template: `
    <div class="week-toggle-wrapper">
      <button
        mat-icon-button
        type="button"
        [disabled]="isLoading()"
        (click)="setDateTo(-1)"
      >
        <mat-icon>keyboard_arrow_left</mat-icon>
      </button>

      <mat-button-toggle-group
        hideSingleSelectionIndicator
        [value]="selectedDay()"
        (valueChange)="toggleValueChange($event)"
      >
        @for(day of weekdays(); track day) {
        <mat-button-toggle
          [disabled]="isLoading() || selectedDay() === day"
          [value]="day"
          [class.is-today]="day | isToday"
        >
          {{ day | date : 'ccc' }}
        </mat-button-toggle>
        }
      </mat-button-toggle-group>

      <button
        mat-icon-button
        type="button"
        [disabled]="isLoading()"
        (click)="setDateTo(+1)"
      >
        <mat-icon>keyboard_arrow_right</mat-icon>
      </button>
    </div>
  `,
})
export class WeekToggleGroupComponent {
  readonly selectedDay = input.required<DateString>();
  readonly calendarWeek = input.required<CalendarWeek>();
  readonly weekdays = input.required<DateString[]>();
  readonly isLoading = input.required<boolean>();

  readonly dateSelected = output<DateString>();

  setDateTo(target: number): void {
    const targetDate = new Date(this.selectedDay());
    targetDate.setDate(targetDate.getDate() + target);
    const formattedDate = formatDateToYearMonthDay(targetDate);
    this.dateSelected.emit(formattedDate);
  }

  toggleValueChange(value: DateString): void {
    if (!value || value === this.selectedDay()) return;

    this.dateSelected.emit(value);
  }
}
