import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';

import {
  CompetitionFixtures,
  FilteredCompetitions,
  MatchDTO,
} from '../../models';
import { DateService, LeagueService } from '../../services';

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
  dateService = inject(DateService);
  leagueService = inject(LeagueService);

  fixtureData = input.required<MatchDTO[]>();

  competitions = computed<CompetitionFixtures[]>(() => {
    const selectedLeague = this.leagueService.selectedLeague;
    const competitions = [
      ...new Set(this.fixtureData().map((f) => f.league.name)),
    ];
    const fixtures = competitions.map((c) => ({
      name: c,
      image:
        this.fixtureData().find((f) => f.league.name === c)?.league.flag || '',
      fixtures: this.fixtureData().filter((f) => f.league.name === c),
    }));
    const filtered = new FilteredCompetitions(fixtures).byLeague(
      selectedLeague()?.label
    );
    return filtered.competitions;
  });
}
