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
  TODAY_DATE_STRING,
  WeekdayFixturesStore,
  WeekdayStandingsStore,
} from '@app/shared';

@Pipe({ name: 'isToday' })
export class IsTodayPipe implements PipeTransform {
  transform = (day: DateString): boolean => day === TODAY_DATE_STRING;
}

@Component({
  selector: 'rs-week-toogle-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    MatButtonToggleModule,
    MatIconModule,
    MatTooltipModule,
    IsTodayPipe,
  ],
  styles: `
    @use "@angular/material" as mat;

    :host { @apply w-full xs:w-fit; touch-action: pan-x pan-y; }

    mat-button-toggle-group {
      @include mat.button-toggle-overrides(
        (
          height: 36px,
          label-text-size: var(--rs-font-size-body-2),
          text-color: var(--rs-color-text-3),
          background-color: var(--rs-color-orange),
          selected-state-background-color: var(--rs-color-white),
          selected-state-text-color: var(--rs-color-orange),
          disabled-state-background-color: var(--rs-color-orange),
          disabled-state-text-color: var(--rs-color-text-3),
          disabled-selected-state-background-color: var(--rs-color-white),
          disabled-selected-state-text-color: var(--rs-color-orange),
        )
      );
      @apply flex border-none;

      mat-button-toggle.mat-button-toggle {
        @apply flex-1 border-l-0;

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
  dateSelected = output<DateString>();

  indexedWeekdays = computed<{ day: DateString; index: number }[]>(() =>
    this.weekdays().map((day) => ({ day, index: new Date(day).getDate() }))
  );

  private weekFixtures = inject(WeekdayFixturesStore);
  private weekStandings = inject(WeekdayStandingsStore);
  isLoading = computed<boolean>(
    () => this.weekFixtures.isLoading() || this.weekStandings.isLoading()
  );

  setDateTo(target: number): void {
    const targetDate = new Date(this.selectedDay());
    targetDate.setDate(targetDate.getDate() + target);
    const formattedDate = moment(targetDate)
      .tz('Europe/Berlin')
      .format('YYYY-MM-DD');
    this.dateSelected.emit(formattedDate);
  }
}
