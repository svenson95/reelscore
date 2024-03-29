import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { DateService } from '../../services';

// TODO: refactor to lib?
@Component({
  selector: 'futbet-week-toogle-group',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatTooltipModule,
  ],
  styles: `
    :host {
      ::ng-deep mat-button-toggle {
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
    }
  `,
  template: `
    <mat-button-toggle-group
      hideSingleSelectionIndicator
      [value]="selectedDayTime()"
    >
      <mat-button-toggle
        (click)="selectedDayTime.set(get('previous-day'))"
        matTooltip="Zurück"
      >
        <mat-icon>keyboard_arrow_left</mat-icon>
      </mat-button-toggle>
      @for(day of weekdays(); track day) {
      <mat-button-toggle [value]="day" (click)="selectedDayTime.set(day)">
        <span class="text-fb-font-size-body-2">
          {{ day | date : 'ccc' }}
        </span>
      </mat-button-toggle>
      }
      <mat-button-toggle
        (click)="selectedDayTime.set(get('next-day'))"
        matTooltip="Weiter"
      >
        <mat-icon>keyboard_arrow_right</mat-icon>
      </mat-button-toggle>
    </mat-button-toggle-group>
  `,
})
export class DateBarWeekToggleGroupComponent {
  private readonly service = inject(DateService);
  readonly selectedDayTime = this.service.selectedDayTime;
  readonly weekdays = this.service.weekdays;

  readonly get = this.service.getDate;
}
