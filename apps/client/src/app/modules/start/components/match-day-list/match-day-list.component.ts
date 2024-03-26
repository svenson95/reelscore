import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'futbet-start-match-day-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `<p>match-day-list works!</p> `,
})
export class MatchDayListComponent {}
