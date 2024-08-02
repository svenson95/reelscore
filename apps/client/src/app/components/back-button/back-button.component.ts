import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

import { DateString, toIsoString } from '../../models';
import { DateService } from '../../services';

@Component({
  selector: 'reelscore-back-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatIconModule, DatePipe],
  styles: `
    :host ::ng-deep .mat-mdc-outlined-button>.mat-icon {
      margin-left: 0;
      margin-right: 0;
    }

    button { --mdc-outlined-button-container-height: 40px; }
    div { @apply flex items-center gap-2; }
    mat-icon { @apply text-[20px] w-[16px] h-[20px]; }
  `,
  template: `
    <button mat-stroked-button extended (click)="navigateBack()">
      <div>
        <span>{{ date() | date : 'dd.MM.yy' }}</span>
        <mat-icon>chevron_left</mat-icon>
      </div>
    </button>
  `,
})
export class BackButtonComponent {
  router = inject(Router);
  ds = inject(DateService);
  date = input.required<string>();

  navigateBack(): void {
    this.setSelectedDate(this.date());
    this.router.navigate(['']);
  }

  setSelectedDate(date: DateString): void {
    const selectedDay = new Date(date);
    const dateStr = toIsoString(selectedDay);
    this.ds.selectedDay.set(dateStr);
  }
}
