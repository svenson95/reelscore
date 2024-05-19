import { Component } from '@angular/core';

import { DateBarComponent, MatchListComponent } from '../../components';
import { COMPETITION_EXAMPLES } from '../../models';
import { RouteService } from '../../services';
import { RouterView } from '../router-view';

@Component({
  selector: 'futbet-league',
  standalone: true,
  imports: [DateBarComponent, MatchListComponent],
  providers: [RouteService],
  styles: `:host { @apply w-full; }`,
  template: `
    <futbet-start-date-bar />
    <futbet-start-match-list [competition]="competition" />
  `,
})
export class LeagueComponent extends RouterView {
  readonly competition = COMPETITION_EXAMPLES[0];
}
