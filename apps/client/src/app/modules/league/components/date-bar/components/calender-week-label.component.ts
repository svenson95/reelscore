import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { CalenderWeek } from '@app/models';

@Component({
  selector: 'futbet-calender-week-label',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule],
  styles: `
    button { @apply fb-as-label; }
  `,
  template: ` <button mat-stroked-button disabled>KW {{ week() }}</button> `,
})
export class CalenderWeekLabelComponent {
  week = input.required<CalenderWeek>();
}
