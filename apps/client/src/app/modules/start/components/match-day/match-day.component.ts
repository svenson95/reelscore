import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { DateService, LeagueService } from '@app/services';
import { FixtureDTO } from '@lib/models';
import { CompetitionFixtures, FilteredCompetitions } from '../../models';
import { FixturesService } from '../../services';
import { MatchDayListComponent } from './components';

@Component({
  selector: 'reelscore-match-day',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatchDayListComponent, MatProgressSpinnerModule],
  styles: `
    :host { @apply flex flex-col; }

    reelscore-match-day-list:not(:last-child) {
        @apply flex flex-col mb-5;
    }
  `,
  template: `
    @if (isLoading()) {
    <mat-spinner class="my-10 mx-auto" diameter="20" />
    } @else { @for (competition of competitions(); track competition.name) {
    <reelscore-match-day-list [competition]="competition" />
    } @empty {
    <p class="no-data">Es finden keine Spiele statt.</p>
    } }
  `,
})
export class MatchDayComponent {
  ds = inject(DateService);
  ls = inject(LeagueService);
  fs = inject(FixturesService);

  isLoading = this.fs.isLoading;

  competitions = computed<CompetitionFixtures[] | undefined>(() => {
    const data = this.fs.fixtures();
    const selectedLeague = this.ls.selectedLeague();
    if (data === undefined) return undefined;

    const competitions = [...new Set(data.map((f) => f.league.name))];
    const fixtures = competitions.map((c) => this.filterByCompetition(c, data));

    const filtered = new FilteredCompetitions(fixtures).byLeague(
      selectedLeague?.label
    );
    return filtered.competitions;
  });

  filterByCompetition = (name: string, data: FixtureDTO[]) => ({
    name,
    image: data.find((f) => f.league.name === name)?.league.flag || 'error',
    fixtures: data.filter((f) => f.league.name === name),
  });
}
