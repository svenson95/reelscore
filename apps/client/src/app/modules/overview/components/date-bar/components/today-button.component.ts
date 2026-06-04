import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import type { DateString } from '@lib/shared';

@Component({
  selector: 'rs-today-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule],
  styles: `
    @use "@angular/material" as mat;

    button {
      @include mat.button-overrides(
        (
          filled-container-height: 36px,
        )
      );
    }
  `,
  template: `
    <button mat-flat-button (click)="clicked.emit()" [disabled]="isToday()">
      Heute
    </button>
  `,
})
export class TodayButtonComponent {
  readonly today = input.required<DateString>();
  readonly isToday = input.required<boolean>();
  readonly clicked = output<void>();
}
