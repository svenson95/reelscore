import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'futbet-start-match-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `<p>match-list works!</p> `,
})
export class MatchListComponent {}
