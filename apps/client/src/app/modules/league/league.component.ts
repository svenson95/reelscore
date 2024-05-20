import { Component, computed, inject } from '@angular/core';

import { DateBarComponent, MatchListComponent } from '../../components';
import { COMPETITION_EXAMPLES, FilteredCompetitions } from '../../models';
import { DateService, ROUTE_SERVICE_PROVIDER } from '../../services';
import { RouterView } from '../router-view';

@Component({
  selector: 'futbet-league',
  standalone: true,
  imports: [DateBarComponent, MatchListComponent],
  providers: [ROUTE_SERVICE_PROVIDER],
  styles: `
    :host { 
      @apply w-full; 

      futbet-start-match-list:not(:last-child) {
        @apply flex flex-col mb-5;
      }

      p {
        @apply text-fb-font-size-body-1 text-fb-color-text-2 text-center py-5;
      }
    }
  `,
  template: `
    <futbet-start-date-bar />

    @for (competition of competitions(); track competition.name) {
    <futbet-start-match-list [competition]="competition" />
    } @empty {
    <p>Es finden keine Spiele statt.</p>
    }
  `,
})
export class LeagueComponent extends RouterView {
  readonly dateService = inject(DateService);

  readonly competitions = computed(() => {
    const filtered = new FilteredCompetitions(COMPETITION_EXAMPLES)
      .byDay(this.dateService.selectedDay())
      .byLeague(this.selectedLeague()?.label);
    return filtered.competitions;
  });
}
