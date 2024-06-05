import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { CalenderWeek } from '@app/models';

@Component({
  selector: 'futbet-calender-week-label',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `:host { @apply flex items-center ml-auto gap-3 text-fb-font-size-body-2 text-fb-color-text-2;  }`,
  template: `KW {{ week() }}`,
})
export class CalenderWeekLabelComponent {
  week = input.required<CalenderWeek>();
}
