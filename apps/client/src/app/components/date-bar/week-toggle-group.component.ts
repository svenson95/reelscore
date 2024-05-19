import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { DateService } from '../../services';

const dateValue = ['previous-day', 'next-day'] as const;
type DateValue = (typeof dateValue)[number];

// TODO: refactor to lib?
@Component({
  selector: 'futbet-week-toogle-group',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatTooltipModule,
  ],
  encapsulation: ViewEncapsulation.None,
  styles: `
    futbet-week-toogle-group mat-button-toggle.mat-button-toggle {
      &.mat-button-toggle-checked {
        @apply bg-fb-color-green-1-light;
      }

      &.mat-button-toggle-appearance-standard .mat-button-toggle-label-content {
        min-width: 36px;
        padding: 0 8px;
      }

      &:first-of-type, &:last-of-type {
        &.mat-button-toggle-appearance-standard .mat-button-toggle-label-content {
          padding: 0 2px;
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
        (click)="setDateTo('previous-day')"
        matTooltip="Zurück"
      >
        <mat-icon>keyboard_arrow_left</mat-icon>
      </mat-button-toggle>
      @for(day of weekdays(); track day) {
      <mat-button-toggle [value]="day" (click)="selectedDay.set(day)">
        <span class="text-fb-font-size-body-2">
          {{ day | date : 'ccc' }}
        </span>
      </mat-button-toggle>
      }
      <mat-button-toggle (click)="setDateTo('next-day')" matTooltip="Weiter">
        <mat-icon>keyboard_arrow_right</mat-icon>
      </mat-button-toggle>
    </mat-button-toggle-group>
  `,
})
export class DateBarWeekToggleGroupComponent {
  private readonly service = inject(DateService);
  readonly selectedDay = this.service.selectedDay;
  readonly weekdays = this.service.weekdays;

  setDateTo(value: DateValue): void {
    const isPreviousDay = value === 'previous-day';
    const d = new Date(this.selectedDay());
    const getDay = (v: number) =>
      new Date(d.setDate(d.getDate() + v)).toISOString();

    if (isPreviousDay) {
      this.selectedDay.set(getDay(-1));
    } else {
      this.selectedDay.set(getDay(+1));
    }
  }
}
