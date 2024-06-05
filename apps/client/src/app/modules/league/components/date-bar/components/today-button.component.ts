import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { DateString, TODAY_ISO_STRING } from '@app/models';

@Component({
  selector: 'futbet-today-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule],
  template: `
    <button mat-stroked-button (click)="setToday()" [disabled]="isToday()">
      Heute
    </button>
  `,
})
export class TodayButtonComponent {
  isToday = input.required<boolean>();
  onClick = output<DateString>();

  setToday = () => this.onClick.emit(TODAY_ISO_STRING);
}
