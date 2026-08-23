import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  Pipe,
  type PipeTransform,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { formatDateToYearMonthDay, type DateString } from '@lib/shared';

import { DateNavigationService } from '../../services';

@Pipe({ name: 'isToday' })
export class IsTodayPipe implements PipeTransform {
  dateNavigationService = inject(DateNavigationService);

  transform = (day: DateString): boolean =>
    day === this.dateNavigationService.today();
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

    button.navigate-button {
      @include mat.icon-button-overrides(
        (
          icon-color: var(--rs-color-text-1),
          disabled-icon-color: var(--rs-border-color-2),
        )
      );
    }

    mat-button-toggle-group.mat-button-toggle-group {
      @include mat.button-toggle-overrides(
        (
          height: 36px,
          label-text-size: var(--rs-font-size-body-2),

          disabled-state-text-color: var(--rs-border-color-2),
          disabled-selected-state-text-color: var(--rs-color-text-1),

          selected-state-background-color: transparent,
          disabled-state-background-color: transparent,
          disabled-selected-state-background-color: transparent,
        )
      );

      position: relative;
      isolation: isolate;

      @apply flex flex-1 mx-px overflow-visible border-none;
      @apply bg-rs-button-bg shadow-rs3;

      border-radius: var(--rs-size-border-radius-2);

      &::before {
        content: '';
        position: absolute;
        z-index: 0;

        inset-block: 0;
        left: 0;

        width: calc(100% / var(--day-count));

        background: var(--rs-color-primary);
        border-radius: var(--rs-size-border-radius-2);

        transform: translateX(
          calc(var(--active-day-index) * 100%)
        );

        transition: transform 250ms cubic-bezier(0.4, 0, 0.2, 1);

        pointer-events: none;
      }

      mat-button-toggle.mat-button-toggle {
        position: relative;
        z-index: 1;

        @apply flex-1;

        min-width: 0;
        border: none;
        background: transparent;

        color: var(--rs-color-text-1);

        transition: color 100ms ease;

        &.mat-button-toggle-checked {
          color: var(--rs-color-text-3);
          transition-delay: 100ms;
        }

        &.is-today ::ng-deep .mat-button-toggle-label-content {
          @apply underline decoration-solid;
        }

        &.mat-button-toggle-appearance-standard ::ng-deep {
          .mat-button-toggle-label-content {
            min-width: 36px;
            padding: 0 8px;
          }

          &:first-of-type,
          &:last-of-type {
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
        class="navigate-button"
        type="button"
        data-testid="week-toggle-prev-btn"
        [disabled]="isLoading()"
        (click)="setDateTo(-1)"
      >
        <mat-icon>keyboard_arrow_left</mat-icon>
      </button>

      <mat-button-toggle-group
        hideSingleSelectionIndicator
        [value]="selectedDay()"
        [style.--active-day-index]="activeDayIndex()"
        [style.--day-count]="weekdays().length"
        (valueChange)="toggleValueChange($event)"
      >
        @for (day of weekdays(); track day) {
        <mat-button-toggle
          [disabled]="isLoading()"
          [value]="day"
          [class.is-today]="day | isToday"
        >
          {{ day | date : 'ccc' }}
        </mat-button-toggle>
        }
      </mat-button-toggle-group>

      <button
        mat-icon-button
        class="navigate-button"
        type="button"
        data-testid="week-toggle-next-btn"
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
  readonly weekdays = input.required<DateString[]>();
  readonly isLoading = input.required<boolean>();

  readonly dateSelected = output<DateString>();

  readonly activeDayIndex = computed(() => {
    const index = this.weekdays().indexOf(this.selectedDay());

    return Math.max(index, 0);
  });

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
