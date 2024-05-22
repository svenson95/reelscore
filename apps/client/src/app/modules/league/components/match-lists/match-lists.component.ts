import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';

import { MatchListComponent } from '../../../../components';
import { CompetitionFixtures } from '../../../../models';
import { DateService, LeagueService } from '../../../../services';

import { COMPETITION_EXAMPLES } from '../../constants';
import { FilteredCompetitions } from '../../models';

@Component({
  selector: 'futbet-league-match-lists',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatchListComponent],
  styles: `
    futbet-league-match-list:not(:last-child) {
        @apply flex flex-col mb-5;
    }

    p {
        @apply text-fb-font-size-body-1 text-fb-color-text-2 text-center py-5;
    }
  `,
  template: `
    @for (competition of fixtures(); track competition.name) {
    <futbet-league-match-list [competition]="competition" />
    } @empty {
    <p>Es finden keine Spiele statt.</p>
    }
  `,
})
export class MatchListsComponent {
  dateService = inject(DateService);
  leagueService = inject(LeagueService);

  fixtures = computed<CompetitionFixtures[]>(() => {
    const selectedLeague = this.leagueService.selectedLeague;
    const filtered = new FilteredCompetitions(COMPETITION_EXAMPLES)
      .byDay(this.dateService.selectedDay())
      .byLeague(selectedLeague()?.label);
    return filtered.competitions;
  });
}
