import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';

import { CompetitionWithFixtures } from '@app/models';
import { FilterService } from '@app/services';
import { FixtureDTO } from '@lib/models';
import { FixturesStore } from '../../../../store';
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
    @if (competitions()?.length) { @for (competition of competitions(); track
    competition.name) {
    <reelscore-start-match-day-list [competition]="competition" />
    } } @else {
    <p class="no-data">
      @if (fixturesStore.isLoading()) { Spiele werden geladen ... } @else { @if
      (fixturesStore.error()) { Fehler beim Laden der Spiele. } @else if
      (fixturesStore.fixtures()?.length === 0) { Es finden keine Spiele statt. }
      @else if (competitions()?.length === 0) { Keine Spiele für diesen
      Wettbewerb gefunden. } }
    </p>
    }
  `,
})
export class MatchesComponent {
  filterService = inject(FilterService);
  fixturesStore = inject(FixturesStore);

  competitions = computed<CompetitionWithFixtures[] | undefined>(() => {
    const fixtures = this.fixturesStore.fixtures();
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
