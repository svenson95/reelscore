import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { DateService } from '../../services';

import { IsTodayPipe } from './pipes/is-today.pipe';

// TODO: refactor to lib?
@Component({
  selector: 'futbet-start-date-bar-week-toogle-group',
  standalone: true,
  imports: [CommonModule, MatButtonToggleModule, IsTodayPipe],
  styles: `
    :host { 
      --mat-standard-button-toggle-selected-state-background-color: var(--fb-color-green-1-light); 
    }
  `,
  template: `
    <mat-button-toggle-group
      hideSingleSelectionIndicator
      [value]="selectedDayTime()"
    >
      @for(day of weekdays(); track day) {
      <mat-button-toggle [value]="day" (click)="selectedDayTime.set(day)">
        <span class="text-fb-font-size-body-2">
          @if (day | isToday) { Heute } @else {
          {{ day | date : 'ccc' }}
          }
        </span>
      </mat-button-toggle>
      }
    </mat-button-toggle-group>
  `,
})
export class DateBarWeekToggleGroupComponent {
  private readonly service = inject(DateService);
  readonly selectedDayTime = this.service.selectedDayTime;
  readonly weekdays = this.service.weekdays;
}
