import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { DateString, TODAY_ISO_STRING } from '@app/shared';

@Component({
  selector: 'reelscore-today-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule],
  styles: `
    button { 
      --mdc-outlined-button-container-height: 36px;
      --mdc-text-button-disabled-label-text-color: var(--rs-color-text-2);
      --mdc-protected-button-container-shape: var(--rs-size-border-radius);
      border: 1px solid var(--mdc-outlined-button-outline-color);

      &:disabled { @apply rs-as-label; }
    }
  `,
  template: `
    <button mat-button (click)="setToday()" [disabled]="isToday()">
      Heute
    </button>
  `,
})
export class TodayButtonComponent {
  isToday = input.required<boolean>();
  onClick = output<DateString>();

  setToday = () => this.onClick.emit(TODAY_ISO_STRING);
}
