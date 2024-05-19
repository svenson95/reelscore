import { Component } from '@angular/core';

import { MatchListComponent } from '../../components';
import { COMPETITION_EXAMPLES } from '../../models';
import { RouteService } from '../../services';
import { RouterView } from '../router-view';

@Component({
  selector: 'futbet-start',
  standalone: true,
  imports: [MatchListComponent],
  styles: `:host { @apply w-full; }`,
  template: ` <futbet-start-match-list [competition]="competition" /> `,
  providers: [RouteService],
})
export class StartComponent extends RouterView {
  readonly competition = COMPETITION_EXAMPLES[0];
}
