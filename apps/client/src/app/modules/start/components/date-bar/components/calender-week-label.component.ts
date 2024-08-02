import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { CalenderWeek } from '@app/models';

@Component({
  selector: 'reelscore-calender-week-label',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule],
  styles: `
    button { 
      --mdc-outlined-button-container-height: 40px;
      @apply fb-as-label; 
    }
  `,
  template: ` <button mat-button disabled>KW {{ week() }}</button> `,
})
export class CalenderWeekLabelComponent {
  week = input.required<CalenderWeek>();
}
