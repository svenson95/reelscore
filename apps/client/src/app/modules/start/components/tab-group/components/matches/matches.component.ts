import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  untracked,
} from '@angular/core';

import {
  COMPETITIONS_ORDER,
  CompetitionWithFixtures,
  FilterService,
  SELECT_COMPETITION_DATA_FLAT,
} from '@app/shared';
import { CompetitionLabel, ExtendedFixtureDTO } from '@lib/models';

import { MatchDayListComponent } from './components';

@Component({
  selector: 'reelscore-matches',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatchDayListComponent],
  styles: `
    :host { @apply flex flex-col gap-5; }
  `,
  template: `
    @if (competitions().length) { @for (competition of competitions(); track
    competition.name) {
    <reelscore-start-match-day-list
      class="animate-fade-in"
      [competition]="competition"
    />
    } } @else {
    <p class="no-data">
      @if (isLoading()) { Spiele werden geladen ... } @else { @if (error()) {
      Fehler beim Laden der Spiele. } @else if (dayFixtures() &&
      dayFixtures().length === 0) { Es finden keine Spiele statt. } @else if
      (competitions() && competitions().length === 0) { Keine Spiele für diesen
      Wettbewerb gefunden. } }
    </p>
    }
  `,
})
export class MatchesComponent {
  private filterService = inject(FilterService);
  dayFixtures = input.required<ExtendedFixtureDTO[]>();
  isLoading = input.required<boolean>();
  error = input.required<string | null>();

  competitions = computed<CompetitionWithFixtures[]>(() => {
    const fixtures = this.dayFixtures();
    return this.initCompetitionsWithFixtures(fixtures);
  });

  initCompetitionsWithFixtures = (
    fixtures: Array<ExtendedFixtureDTO> | null
  ): Array<CompetitionWithFixtures> => {
    if (!fixtures) return [];
    const allCompetitions = [...new Set(fixtures.map((f) => f.league.name))];
    const competitions: Array<CompetitionWithFixtures> = allCompetitions
      .map(this.groupFixturesToCompetitions)
      .sort((a, b) => {
        const ORDER = COMPETITIONS_ORDER;
        const endOfList = Object.keys(ORDER).length + 1;
        return (ORDER[a.name] || endOfList) - (ORDER[b.name] || endOfList);
      });

    const filter = this.filterService.selectedCompetition();
    const filtered = competitions.filter((c) => c.id === filter);
    return filter ? filtered : competitions;
  };

  private groupFixturesToCompetitions = (name: CompetitionLabel) => {
    const fixtures = untracked(this.dayFixtures);
    const fixture = fixtures.find((f) => f.league.name === name);
    const competition = SELECT_COMPETITION_DATA_FLAT.find(
      (c) => c.id === fixture?.league.id
    );
    if (!fixture || !competition) throw new Error(`Not found ('${name}')`);
    return {
      name,
      url: ['/', 'competition', competition.url],
      id: fixture.league.id || -1,
      image: fixture.league.flag || 'error',
      fixtures: fixtures.filter((f) => f.league.name === name),
    };
  };
}
