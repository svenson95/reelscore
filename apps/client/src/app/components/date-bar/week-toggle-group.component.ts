import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { DateService } from '../../services';

// TODO: refactor to lib?
@Component({
  selector: 'futbet-start-date-bar-week-toogle-group',
  standalone: true,
  imports: [CommonModule, MatButtonToggleModule],
  template: `
    <mat-button-toggle-group
      hideSingleSelectionIndicator
      [value]="selectedDayTime()"
    >
      @for(day of weekdays(); track day) {
      <mat-button-toggle [value]="day" (click)="selectedDayTime.set(day)">
        <span>{{ day | date : 'dd.' }}</span>
      </mat-button-toggle>
      }
    </mat-button-toggle-group>
  `,
})
export class DateBarWeekToggleGroupComponent {
  readonly service = inject(DateService);
  readonly selectedDayTime = this.service.selectedDayTime;
  readonly weekdays = this.service.weekdays;
}
