import { Component, computed, inject } from '@angular/core';

import { DateBarComponent, MatchListComponent } from '../../components';
import { LEAGUE_STANDING_EXAMPLES } from '../../constants';
import { CompetitionFixtures, CompetitionStandings } from '../../models';
import { DateService, ROUTE_SERVICE_PROVIDER } from '../../services';

import { RouterView } from '../router-view';

import { TableComponent } from './components';
import { COMPETITION_EXAMPLES } from './constants';
import { FilteredCompetitions } from './models';

@Component({
  selector: 'futbet-league',
  standalone: true,
  imports: [DateBarComponent, MatchListComponent, TableComponent],
  providers: [ROUTE_SERVICE_PROVIDER],
  styles: `
    :host { 
      @apply w-full; 

      section {
        @apply inline-flex flex-wrap w-full gap-5;

        > * {
          @apply flex-1;
        }
      }

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

    <section>
      @for (competition of competitions(); track competition.name) {
      <futbet-match-list [competition]="competition" />
      } @empty {
      <p>Es finden keine Spiele statt.</p>
      } @if (league() !== undefined) {
      <futbet-league-table [league]="leagueData" />
      }
    </section>
  `,
})
export class LeagueComponent extends RouterView {
  readonly dateService = inject(DateService);

  league = computed<CompetitionStandings | undefined>(() => {
    return LEAGUE_STANDING_EXAMPLES.find(
      (s) => s.name === this.selectedLeague()?.label
    );
  });

  get leagueData(): CompetitionStandings {
    const leagueData = this.league();
    if (!leagueData) throw new Error('League is unexpectedly undefined');
    return leagueData;
  }

  competitions = computed<CompetitionFixtures[]>(() => {
    const filtered = new FilteredCompetitions(COMPETITION_EXAMPLES)
      .byDay(this.dateService.selectedDay())
      .byLeague(this.selectedLeague()?.label);
    return filtered.competitions;
  });
}
