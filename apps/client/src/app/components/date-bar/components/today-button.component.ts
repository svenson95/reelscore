import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { DateString, TODAY_ISO_STRING } from '../../../models';

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
  isToday = input.required<boolean>();

  onClick = output<DateString>();

  setToday(): void {
    this.onClick.emit(TODAY_ISO_STRING);
  }
}
