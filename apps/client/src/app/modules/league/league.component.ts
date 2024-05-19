import { Component, computed } from '@angular/core';

import { DateBarComponent, MatchListComponent } from '../../components';
import { COMPETITION_EXAMPLES } from '../../models';
import { RouteService } from '../../services';
import { RouterView } from '../router-view';

@Component({
  selector: 'futbet-league',
  standalone: true,
  imports: [DateBarComponent, MatchListComponent],
  providers: [RouteService],
  styles: `
    :host { 
      @apply w-full; 

      futbet-start-match-list:not(:last-child) {
        @apply flex flex-col mb-5;
      }
    }
  `,
  template: `
    <futbet-start-date-bar />

    @for (competition of competitions(); track competition.name) {
    <futbet-start-match-list [competition]="competition" />
    }
  `,
})
export class LeagueComponent extends RouterView {
  readonly competitions = computed(() => {
    const url = this.selectedLeague()?.label;
    const filtered = COMPETITION_EXAMPLES.filter((c) => c.name === url);
    return url ? filtered : COMPETITION_EXAMPLES;
  });
}
