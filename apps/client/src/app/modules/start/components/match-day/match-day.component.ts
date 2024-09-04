import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';

import { FixtureDTO } from '@lib/models';
import { FixturesStore } from '../../../../store';
import { CompetitionFixtures, FilteredCompetitions } from '../../models';
import { FilterService } from '../../services';
import { MatchDayListComponent } from './components';

@Component({
  selector: 'reelscore-match-day',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatchDayListComponent],
  styles: `
    :host { @apply flex flex-col; }

    reelscore-match-day-list:not(:last-child) {
        @apply flex flex-col mb-5;
    }
  `,
  template: `
    @if (data.fixtures()) { @if (data.isLoading()) {
    <p class="no-data">Spiele werden geladen ...</p>
    } @else if (data.error()) {
    <p class="no-data">Fehler beim Laden der Spiele.</p>
    } @else if (data.fixtures()?.length === 0) {
    <p class="no-data">Es finden keine Spiele statt.</p>
    } @else if (competitions()?.length === 0) {
    <p class="no-data">Keine Spiele für diesen Wettbewerb gefunden.</p>
    } @else { @for (competition of competitions(); track competition.name) {
    <reelscore-match-day-list [competition]="competition" />
    } } }
  `,
})
export class MatchDayComponent {
  filterService = inject(FilterService);
  fixturesStore = inject(FixturesStore);
  data = this.fixturesStore;

  competitions = computed<CompetitionFixtures[] | undefined>(() => {
    const fixtures = this.data.fixtures();
    if (fixtures === undefined || fixtures === null) return undefined;

    const fixturesCompetitions = [
      ...new Set(fixtures.map((f) => f.league.name)),
    ];
    const competitions = fixturesCompetitions.map((competitionName) =>
      this.filterByCompetition(competitionName, fixtures)
    );

    const id = this.filterService.selectedCompetition();
    const filtered = new FilteredCompetitions(competitions).byLeague(id);
    return filtered.competitions;
  });

  filterByCompetition = (
    name: string,
    data: FixtureDTO[]
  ): CompetitionFixtures => ({
    name,
    id: data.find((f) => f.league.name === name)?.league.id || -1,
    image: data.find((f) => f.league.name === name)?.league.flag || 'error',
    fixtures: data.filter((f) => f.league.name === name),
  });
}
