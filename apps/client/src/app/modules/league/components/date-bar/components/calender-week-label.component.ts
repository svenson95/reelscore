import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { CalenderWeek } from '@app/models';

@Component({
  selector: 'futbet-calender-week-label',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule],
  styles: `:host { @apply flex items-center ml-auto gap-3 text-fb-font-size-body-2 text-fb-color-text-2;  }`,
  template: `<button mat-stroked-button disabled>KW {{ week() }}</button>`,
})
export class CalenderWeekLabelComponent {
  week = input.required<CalenderWeek>();
}
