import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { DateString } from '@app/shared';

@Component({
  selector: 'rs-today-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule],
  styles: `
    @use "@angular/material" as mat;
    
    button { 
      --mdc-outlined-button-container-height: 36px;
      --mdc-text-button-disabled-label-text-color: var(--rs-color-text-2);
      --mdc-protected-button-container-shape: var(--rs-size-border-radius);
      border: 1px solid var(--mdc-outlined-button-outline-color);

      &:disabled { @apply rs-as-label; }

      @include mat.button-overrides(
        (
          filled-container-height: 36px,
        )
      );
    }
  `,
  template: `
    <button mat-flat-button (click)="setToday(today())" [disabled]="isToday()">
      Heute
    </button>
  `,
})
export class TodayButtonComponent {
  today = input.required<DateString>();
  isToday = input.required<boolean>();
  clicked = output<DateString>();

  setToday(today: DateString): void {
    this.clicked.emit(today);
  }
}
