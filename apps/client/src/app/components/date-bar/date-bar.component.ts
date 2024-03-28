import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { DateService } from '../../services';

import { DateBarDatePickerComponent } from './date-picker.component';
import { DateBarWeekToggleGroupComponent } from './week-toggle-group.component';

export const TODAY = new Date();
export type DayTime = number;

// TODO: refactor to lib?
@Component({
  selector: 'futbet-start-date-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    DateBarDatePickerComponent,
    DateBarWeekToggleGroupComponent,
  ],
  styles: `:host { @apply flex flex-wrap mb-5 justify-center gap-3 sm:gap-5; }`,
  template: `
    <section class="flex items-center">
      <futbet-start-date-bar-date-picker class="flex items-center" />

      <button
        mat-icon-button
        color="primary"
        (click)="selectedDayTime.set(getDay(-1))"
        matTooltip="Vorherige Woche"
      >
        <mat-icon>keyboard_arrow_left</mat-icon>
      </button>
      <button
        mat-icon-button
        color="primary"
        (click)="selectedDayTime.set(getDay(+1))"
        matTooltip="Nächste Woche"
      >
        <mat-icon>keyboard_arrow_right</mat-icon>
      </button>

      <span class="min-w-[100px] ml-5 text-fb-font-size-small">
        {{ selectedDayTime() | date : 'EEEE' }}
      </span>

      <span class="text-fb-font-size-small">
        {{ selectedDayTime() | date : 'dd.MM.YYYY' }}
      </span>
    </section>

    <futbet-start-date-bar-week-toogle-group
      class="flex items-center min-[600px]:mr-5"
    />
  `,
})
export class DateBarComponent {
  readonly service = inject(DateService);
  readonly selectedDayTime = this.service.selectedDayTime;

  getDay(index: number): DayTime {
    const date = new Date(this.selectedDayTime());
    date.setDate(date.getDate() + index);
    return date.getTime();
  }
}
