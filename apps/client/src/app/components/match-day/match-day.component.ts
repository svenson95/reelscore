import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';

import { MatchDTO } from '@lib/models';

import { CompetitionFixtures, FilteredCompetitions } from '../../models';
import { FixturesService, LeagueService } from '../../services';

import { MatchDayListComponent } from './components';

@Component({
  selector: 'futbet-match-day',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatchDayListComponent],
  styles: `
    futbet-match-day-list:not(:last-child) {
        @apply flex flex-col mb-5;
    }

    p {
        @apply text-fb-font-size-body-1 text-fb-color-text-2 text-center py-5;
    }
  `,
  template: `
    @for (competition of competitions(); track competition.name) {
    <futbet-match-day-list [competition]="competition" />
    } @empty {
    <p>Es finden keine Spiele statt.</p>
    }
  `,
})
export class MatchDayComponent {
  ls = inject(LeagueService);
  fs = inject(FixturesService);

  competitions = computed<CompetitionFixtures[]>(() => {
    const data = this.fs.fixtures();
    const selectedLeague = this.ls.selectedLeague();
    if (data === undefined) return [];

    const competitions = [...new Set(data.map((f) => f.league.name))];
    const fixtures = competitions.map((c) => this.filterByCompetition(c, data));

    const filtered = new FilteredCompetitions(fixtures).byLeague(
      selectedLeague?.label
    );
    return filtered.competitions;
  });

  filterByCompetition = (name: string, data: MatchDTO[]) => ({
    name,
    image: data.find((f) => f.league.name === name)?.league.flag || 'error',
    fixtures: data.filter((f) => f.league.name === name),
  });
}
