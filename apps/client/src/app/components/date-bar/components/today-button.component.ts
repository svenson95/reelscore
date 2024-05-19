import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { TODAY } from '../../../models';
import { DateService } from '../../../services';

@Component({
  selector: 'futbet-today-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule],
  styles: `
      button {
        @apply text-fb-font-size-body-2;
      }
    `,
  template: `
    <button mat-raised-button (click)="setToday()" [disabled]="isToday()">
      Heute
    </button>
  `,
})
export class TodayButtonComponent {
  private readonly dateService = inject(DateService);
  readonly isToday = this.dateService.isToday;

  setToday(): void {
    this.dateService.selectedDay.set(TODAY.toISOString());
  }
}
