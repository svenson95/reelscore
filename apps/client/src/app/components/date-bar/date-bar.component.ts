import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { DateService } from '../../services';

import { DateBarDatePickerComponent } from './date-picker.component';
import { DateBarWeekToggleGroupComponent } from './week-toggle-group.component';

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
  styles: `
    :host { 
      @apply flex flex-wrap mb-5 justify-center gap-3 sm:gap-5; 
      --mdc-text-button-label-text-color: var(--fb-color-green-1);
    }
    mat-icon { @apply translate-y-[-2px]; }
  `,
  template: `
    <section class="flex items-center">
      <futbet-date-picker />

      <button
        mat-icon-button
        color="primary"
        (click)="selectedDayTime.set(get('previous-week'))"
        matTooltip="Vorherige Woche"
      >
        <mat-icon>keyboard_arrow_left</mat-icon>
      </button>
      <span class="min-w-[40px] text-center text-fb-font-size-body-2">
        KW {{ selectedDayTime() | date : 'w' }}
      </span>
      <button
        mat-icon-button
        color="primary"
        (click)="selectedDayTime.set(get('next-week'))"
        matTooltip="Nächste Woche"
      >
        <mat-icon>keyboard_arrow_right</mat-icon>
      </button>

      <button
        mat-button
        class="mx-3 text-fb-font-size-body-2"
        (click)="selectedDayTime.set(get('today'))"
      >
        Heute
      </button>

      <span class="text-fb-font-size-body-2">
        {{ selectedDayTime() | date : 'dd.MM.YY' }}
      </span>
    </section>

    <futbet-week-toogle-group />
  `,
})
export class DateBarComponent {
  readonly service = inject(DateService);
  readonly selectedDayTime = this.service.selectedDayTime;

  readonly get = this.service.getDate;
}
