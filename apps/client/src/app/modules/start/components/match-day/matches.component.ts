import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';

import { FixtureDTO } from '@lib/models';
import { FixturesStore } from '../../../../store';
import { CompetitionWithFixtures } from '../../models';
import { FilterService } from '../../services';
import { MatchDayListComponent } from './components';

@Component({
  selector: 'reelscore-matches',
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
    @if (data.isLoading() && !data.fixtures()) {
    <p class="no-data">Spiele werden geladen ...</p>
    } @else if (data.error()) {
    <p class="no-data">Fehler beim Laden der Spiele.</p>
    } @else if (data.fixtures()?.length === 0) { @if (data.isLoading()) {
    <p class="no-data">Spiele werden geladen ...</p>
    } @else {
    <p class="no-data">Es finden keine Spiele statt.</p>
    } } @else if (competitions()?.length === 0) {
    <p class="no-data">Keine Spiele für diesen Wettbewerb gefunden.</p>
    } @else { @for (competition of competitions(); track competition.name) {
    <reelscore-match-day-list [competition]="competition" />
    } }
  `,
})
export class MatchesComponent {
  filterService = inject(FilterService);
  fixturesStore = inject(FixturesStore);
  data = this.fixturesStore;

  competitions = computed<CompetitionWithFixtures[] | undefined>(() => {
    const fixtures = this.data.fixtures();
    if (fixtures === undefined || fixtures === null) return undefined;
    return this.getCompetitionWithFixtures(fixtures);
  });

  getCompetitionWithFixtures = (
    fixtures: Array<FixtureDTO>
  ): Array<CompetitionWithFixtures> => {
    const allCompetitions = [...new Set(fixtures.map((f) => f.league.name))];
    const competitions: Array<CompetitionWithFixtures> = allCompetitions.map(
      (name) => ({
        name,
        id: fixtures.find((f) => f.league.name === name)?.league.id || -1,
        image:
          fixtures.find((f) => f.league.name === name)?.league.flag || 'error',
        fixtures: fixtures.filter((f) => f.league.name === name),
      })
    );

    const filter = this.filterService.selectedCompetition();
    const filtered = competitions.filter((c) => c.id === filter);
    return filter ? filtered : competitions;
  };
}
