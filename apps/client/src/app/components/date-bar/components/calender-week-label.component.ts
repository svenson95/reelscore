import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DateService } from '../../../services';

@Component({
  selector: 'futbet-calender-week-label',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `:host { @apply flex items-center ml-auto gap-3 text-fb-font-size-body-2 text-fb-color-text-2;  }`,
  template: `KW {{ selectedCalenderWeek() }}`,
})
export class CalenderWeekLabelComponent {
  private readonly dateService = inject(DateService);
  readonly selectedCalenderWeek = this.dateService.calenderWeek;
}
