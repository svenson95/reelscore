import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';

import { DateService, LeagueService } from '../../../../services';

import { COMPETITION_EXAMPLES } from '../../constants';
import { FilteredCompetitions } from '../../models';

import { MatchDayListComponent } from './components';

@Component({
  selector: 'futbet-league-match-day',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatchDayListComponent],
  styles: `
    futbet-league-match-day-list:not(:last-child) {
        @apply flex flex-col mb-5;
    }

    p {
        @apply text-fb-font-size-body-1 text-fb-color-text-2 text-center py-5;
    }
  `,
  template: `
    @for (competition of fixtures(); track competition.name) {
    <futbet-league-match-day-list [competition]="competition" />
    } @empty {
    <p>Es finden keine Spiele statt.</p>
    }
  `,
})
export class MatchDayComponent {
  dateService = inject(DateService);
  leagueService = inject(LeagueService);

  fixtureData = COMPETITION_EXAMPLES;

  fixtures = computed(() => {
    const selectedDay = this.dateService.selectedDay();
    const selectedLeague = this.leagueService.selectedLeague;
    const filtered = new FilteredCompetitions(this.fixtureData)
      .byDay(selectedDay)
      .byLeague(selectedLeague()?.label);
    return filtered.competitions;
  });
}
